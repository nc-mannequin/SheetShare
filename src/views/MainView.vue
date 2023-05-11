<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection,onSnapshot, doc, getFirestore, setDoc, updateDoc, deleteDoc, Timestamp, getDoc, getDocs, query, where } from 'firebase/firestore'
import VuePdfEmbed from 'vue-pdf-embed'

export default{
  name: 'HomePage',
  components: {
    VuePdfEmbed,
  },
  data () {
    return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        file:{},
        group_text:"",
        user_group:[],
        own_materials:[],
        group_member:{},
        member_text:"",
        master_data:{},
        upload_file_detail:{
          level:"",
          subject:"",
          description:""
        }
    }
  },
  beforeMount () {
    const db = getFirestore()
    const colRef = collection(db,'user')
    onSnapshot(colRef, async snapShot => {
      const current_user = this.auth.currentUser
      const exist_user = snapShot.docs.map(doc => [doc.id,doc.data()] ).filter(f => f[1].user_id == current_user.uid)
      const docRef = doc(collection(db,"user"))
      if(exist_user.length == 0){
        const dataObj = {
          created_at: Timestamp.now(),
          display_name:current_user.displayName,
          fav_materials_id:[],
          group_id:[],
          identifier_email:current_user.email,
          own_materials_id:[],
          photo_url:"",
          updated_at:Timestamp.now(),
          user_id:current_user.uid
        }
        const insertRef = await setDoc(docRef, dataObj)
        this.user = insertRef
      }
      else
      {
        this.userId = exist_user[0][0]
        this.user = exist_user[0][1]
      }
      const groupColRef = collection(db,"group")
      onSnapshot(groupColRef, (snapShot) => 
      {
        this.user_group = snapShot.docs.map(doc => [doc.id,doc.data()]).filter(f => this.user.group_id.includes(f[0]))
        for (let index = 0; index < this.user_group.length; index++) {
          console.log(this.user_group[index][0])
          console.log(this.user_group[index][1])
          const target_group_members_id = this.user_group[index][1].members
          target_group_members_id.forEach(async id => {
            const queryCondition = query(collection(db,"user"), where("user_id","==",id))
            const target_user = await getDocs(queryCondition)
            const group_key = this.user_group[index][0]
            const user_key = id
            this.group_member[[group_key,user_key]] = target_user.docs[0].data().display_name
            console.log(this.group_member)
            // [this.user_group[index][0]][id] = target_user.docs[0].data().display_name
            // this.group_member[this.user_group[index][0]][id] == undefined ? [target_user.docs[0].data().display_name] : this.group_member[this.user_group[index][0]].concat(target_user.docs[0].data().display_name)
          });
          
        }
      })
      const materialColRef = collection(db,"material")
      onSnapshot(materialColRef,(snapShot) => {
        this.own_materials = snapShot.docs.map(doc => [doc.id,doc.data()]).filter(f => this.user.own_materials_id.includes(f[0]))
        this.own_materials.forEach((material) => {
          const storage = getStorage();
          const fileRef = ref(storage, material[1].file_url);
          getDownloadURL(fileRef).then((url) => {material[2] = url})
        })
      })
    },(err)=>{console.log(err)})

    const MasterDataColRef = collection(db,"master_data")
    onSnapshot(MasterDataColRef
    ,(snapShot) => {
      this.master_data = snapShot.docs.map(doc => doc.data())
    }
    ,(err) => {console.log(err)})
    

    onAuthStateChanged(this.auth, (user) => {
            if(user) {
                this.isLoggedIn= true
            } else {
                this.isLoggedIn= false
            }
        })

    // console.log(this.group_member['k40udYYsJqxLWJc2GyVd','OBCdVKibs0Q2kW6VT6OZnyAwsFj2'])
    
  },
  methods: {
    logout () {
      console.log('logout')
      signOut(this.auth) 
            .then (()=>{
                this.$router.replace('/login')
                window.location.reload();
            })
            .catch((error)=>{
                alert(error.message)
            })
    },
    onDownloadFile(path){
      // Create a reference to the file we want to download
      console.log(path)
      const storage = getStorage();
      const starsRef = ref(storage, path);
      getDownloadURL(starsRef)
      .then((url)=>{
        console.log(url)
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.onloadend = (event) => {
          console.log(path)
          console.log(event)
          console.log(xhr)
          const url = window.URL.createObjectURL(xhr.response);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', path.slice(42));
          document.body.appendChild(link);
          link.click();
        }
        
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.log(error)
      })
    },
    onUploadChange(event){
      console.log(event)
      this.file = event.target.files
    },
    onUploadSubmit(event){
      console.log(this.file)
      console.log(event)
      if(this.upload_file_detail.description == "" || this.upload_file_detail.level == "" || this.upload_file_detail.subject == ""){
        alert("please fill out the form. u buffoon.")
      }
      else
      {
        for (let index = 0; index < this.file.length; index++) {
          const afile = this.file[index];
          if(afile.name!=undefined ){
          const storage = getStorage();
          const url = this.user.user_id.concat("/",Date.now().toString(),afile.name)
          const storageRef = ref(storage, url);
          uploadBytes(storageRef, afile)
          .then(async (snapshot)=>{
            console.log(snapshot.metadata)
            const db = getFirestore()
            const materialDocRef = doc(collection(db,"material"))
            const materialDataObj = {
              comments:[],
              created_at: Timestamp.now(),
              description:this.upload_file_detail.description,
              file_url:snapshot.metadata.fullPath,
              level:this.upload_file_detail.level,
              likes:[],
              subject:this.upload_file_detail.subject,
              tags:[],
              title:snapshot.metadata.fullPath.slice(42),
              user_id:this.user.user_id
            }
            await setDoc(materialDocRef, materialDataObj).then(()=>{
              this.upload_file_detail.level = ""
              this.upload_file_detail.subject = ""
              this.upload_file_detail.description = ""
            })
            const userDocRef = doc(db,"user/"+this.userId)
            var arr_id = []
            arr_id = arr_id.concat(this.user.own_materials_id)
            const dataObj = {
              own_materials_id: arr_id.concat(materialDocRef.id)
            }
            await updateDoc(userDocRef, dataObj)
          })
        }
      }
      }
      
      document.getElementById("file_upload").value = ""
      
    },
    async onDeleteFile(docRefId){
      console.log("on delete =>",docRefId)
      const db = getFirestore()
      const docRef = doc(db,"user/"+this.userId)
      var arr_id = []
      arr_id = arr_id.concat(this.user.own_materials_id)
      console.log(arr_id)
      const dataObj = {
        own_materials_id: arr_id.filter(f => f!=docRefId)
      }
      console.log(dataObj)
      const updateRef = await updateDoc(docRef, dataObj)
    },
    async onNewGroupClick(){
      console.log(this.group_text)
      const db = getFirestore()
      const groupDocRef = doc(collection(db,"group"))
      const dataObj = {
          created_at: Timestamp.now(),
          created_by: this.user.display_name,
          description: "temp_description",
          group_name: this.group_text,
          materials:[],
          members:[this.user.user_id]
      }
      const insertRef = await setDoc(groupDocRef, dataObj)
      const userDocRef = doc(db,"user/"+this.userId)
      var arr_id = []
      arr_id = arr_id.concat(this.user.group_id)
      const userDataObj = {
        group_id: arr_id.concat(groupDocRef.id)
      }
      const updateRef = await updateDoc(userDocRef, userDataObj)

    },
    async onLeaveGroupClick(group_id){
      const db = getFirestore()

      const groupDocRef = doc(db,"group/"+group_id)
      var arr_id = []
      arr_id = arr_id.concat(this.user_group.filter(f => f[0] == group_id)[0][1].members)
      console.log(arr_id)
      console.log(arr_id[0])
      console.log(arr_id[0][1])
      const groupDataObj = {
        members: arr_id.filter(f=>f!=this.user.user_id)
      }
      await updateDoc(groupDocRef, groupDataObj)

      const docRef = doc(db,"user/"+this.userId)
      var arr_id = []
      arr_id = arr_id.concat(this.user.group_id)
      const dataObj = {
        group_id: arr_id.filter(f => f!=group_id)
      }
      await updateDoc(docRef, dataObj)

      
    },
    getFilenameFromId(fileId){
      const target_file = this.own_materials.find( file => file[0] == fileId )
      return target_file != undefined ? target_file[1].title : "Error, File Not Found"
    },
    getFilePathFromFileId(fileId){
      return this.own_materials.find( file => file[0] == fileId )[1].file_url
    },
    async onAddMemberClick(group_key){
      const db = getFirestore()
      const queryCondition = query(collection(db,"user"), where("user_id","==",this.member_text))
      const target_user = await getDocs(queryCondition)
      if(target_user.empty){
        alert("user not found.")
      }
      else
      {
        const groupDocRef = doc(db,"group/"+group_key)
        var arr_member_id = []
        console.log(this.user_group.find(f => f[0] == group_key))
        arr_member_id = arr_member_id.concat(this.user_group.find(f => f[0] == group_key)[1].members)
        const dataObj = {
            members:arr_member_id.concat(this.member_text)
        }
        await updateDoc(groupDocRef, dataObj)

        const userDocRef = doc(db,"user/"+target_user.docs[0].id)
        var arr_group_id = []
        arr_group_id = arr_group_id.concat(target_user.docs[0].get("group_id"))
        const userDataObj = {
          group_id: arr_group_id.concat(groupDocRef.id)
        }
        const updateRef = await updateDoc(userDocRef, userDataObj)
      }
    },
    onPreviewFile(fileId){
      console.log(fileId)
      var target = this.own_materials.find(id => id[0] == fileId)
      if(target){
        target = target[1].file_url
      }
      var url_for_source = ""
      console.log(target)
      // Create a reference to the file we want to Preview
      const storage = getStorage();
      const starsRef = ref(storage, target);
      const result = getDownloadURL(starsRef)
      .then((url)=>{
        const canvas = document.getElementById(fileId)
        console.log(canvas)
        canvas.source = url
        url_for_source = url
        console.log(url_for_source)
      })
      .catch((error) => {
        console.log(error)
      })
      console.log(url_for_source)
    },
    

      
  },
  
}
</script>

<template>
<body>
  <nav class="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-2 mb-5" id="mainNav">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center"><RouterLink to="/home"><img src="/src/assets/img/Logo-SheetShare.png" width="40" height="40" alt="icon"><span> SheetShare</span></RouterLink></a>
        </div>
    </nav>
    <section class="py-4 mt-5">
        <div class="container-fluid">
          <div class="row">
                <div class="col-md-3 border-end">
                  <div style="position: sticky; top: 80px;">
                    <div class="card border-0">
                        <div class="card-body">
                        <div class="text-center">
                          <h3><strong>{{ user.display_name }}</strong></h3>
                        </div>
                            <div class="text-center mt-3">
                              <div v-if="user?.photo_url != ''">
                                <img :src=user.photo_url alt="user_img" class="close-image">
                              </div>
                              <div v-else>
                                <button class="btn btn-primary shadow btn-circle btn-xl btn-disabled"><h3 class="mt-2">{{ user?.display_name ? user.display_name.charAt(0) : "" }}</h3></button>
                              </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0">
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                  <RouterLink to="/home">
                                    <span class="material-symbols-outlined mx-2 thispage">library_books</span>
                                    <span class="underline"><strong>Home</strong></span>
                                  </RouterLink>
                                </li>
                                <li class="list-group-item">
                                  <RouterLink to="/main">
                                    <span class="material-symbols-outlined mx-2">group</span>
                                    Group
                                  </RouterLink>
                                </li>
                                <li class="list-group-item">
                                  <RouterLink to="/profile">
                                    <span class="material-symbols-outlined mx-2">person</span>
                                    Profile
                                  </RouterLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="d-grid gap-2 text-center mt-5 mx-4">
                        <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop-logout">Logout</button>
                    </div>

                    <br>
                    <div class="mt-5 mb-5"></div>
                    
                  </div>
                </div>

                <div class="col-md-9">
                  <h1 class="mb-3">Upload file</h1>
                  <label for="formFileMultiple" class="form-label"><h3>Choose file(s) to upload.</h3></label>
                  <input class="form-control mb-3" id="file_upload" type="file" multiple @change="onUploadChange">
                  

                  <label for="levelDataList" class="form-label"><h3>Level</h3></label>
                  <input class="form-control mb-3" list="leveldatalistOptions" id="levelDataList" placeholder="Type to search..." v-model="upload_file_detail.level">
                  <datalist id="leveldatalistOptions">
                    <option v-for="level in this.master_data.length > 0 ? this.master_data.find(opt => opt.option_name == 'level').options : []" :value=level></option>
                  </datalist>

                  <label for="subjectDataList" class="form-label"><h3>Subject</h3></label>
                  <input class="form-control mb-3" list="subjectdatalistOptions" id="subjectDataList" placeholder="Type to search..." v-model="upload_file_detail.subject">
                  <datalist id="subjectdatalistOptions">
                    <option v-for="subject in this.master_data.length > 0 ? this.master_data.find(opt => opt.option_name == 'subject').options : []" :value=subject></option>
                  </datalist>

                  <label for="descriptionTextarea" class="form-label"><h3>Description</h3></label><br>
                  <textarea class="w-100" id="descriptionTextarea" rows="3" v-model="upload_file_detail.description"></textarea><br>

                  <button class="btn btn-outline-primary" type="button" @click="onUploadSubmit">Submit</button>

                  <p>own material</p>
                  <ul>
                    <li v-for="material in own_materials">
                      <!-- {{ material }} <br> -->
                      {{ material[1].title }}
                      <button class="btn btn-default"  @click="onDownloadFile(material[1].file_url)">DownLoad</button>
                      <button class="btn btn-default"  @click="onDeleteFile(material[0])">Delete</button>
                      <div v-if="material[2] != undefined">
                        <vue-pdf-embed :source=material[2] height="200" :disable-text-layer=true :page="1" />
                      </div>
                      <!-- {{ getFilenameFromId(fileId) }}
                      <button class="btn btn-default"  @click="onDownloadFile(getFilePathFromFileId(fileId))">DownLoad</button>
                      <button class="btn btn-default"  @click="onDeleteFile(fileId)">Delete</button> -->
                      <!-- {{ onPreviewFile(getFilePathFromFileId(fileId)) }} -->
                      <!-- <vue-pdf-embed :source="onPreviewFile(fileId) ? onPreviewFile(fileId):''" :id=fileId /> -->
                      <!-- <vue-pdf-embed :id=fileId /> -->
                      <!-- <vue-pdf-embed source="https://firebasestorage.googleapis.com/v0/b/sheetshare-7e0d8.appspot.com/o/OBCdVKibs0Q2kW6VT6OZnyAwsFj2%2F1683355781183ResumeButFromWatek%20(1).pdf?alt=media&token=754b2e1c-bf99-48f8-b387-5faeac282d2b" :id=fileId /> -->
                      
                    </li>      
                  </ul>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br>
                  <footer>
                    <div class="container py-4 py-lg-5 mt-5">
                      <div class="row row-cols-2 row-cols-md-4">
                        <div class="col-12 col-md-5">
                          <div class="fw-bold d-flex align-items-center mb-2"><span style="font-size: 30px;">SheetShare</span></div>
                          <p class="text-muted">Collaborative platform and extensive library of educational resources.</p>
                        </div>
                      </div>
                      <hr>
                      <div class="text-muted d-flex justify-content-between align-items-center pt-3">
                        <p class="mb-0">Copyright © 2023 SheetShare</p>
                      </div>
                    </div>
                    </footer>
                </div>
          </div>
        </div>
    </section>

    <div class="modal fade" id="staticBackdrop-logout" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 underline" id="staticBackdropLabel"><strong>Logout</strong></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to logout?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" @click="logout">Logout</button>
              </div>
            </div>
          </div>
    </div>
    
</body>
<!-- <h1>This is the MAIN PAGE!</h1>
  <section name="user">
      <img :src=user.photo_url alt="user_img">
      <h1>{{ user.display_name }} </h1>
      <h3>{{ user.identifier_email }}</h3>
      <p>own material</p>
      <ul>
          <li v-for="fileId in user.own_materials_id">
            {{ getFilenameFromId(fileId) }}
            <button class="btn btn-default"  @click="onDownloadFile(getFilePathFromFileId(fileId))">DownLoad</button>
            <button class="btn btn-default"  @click="onDeleteFile(getFilePathFromFileId(fileId))">Delete</button>
          </li>      
      </ul>
      <br>
      <p>fav material</p>
      <ul>
          <li v-for="filename in user.fav_materials_id">
            {{ filename.slice(42) }} 
            <button class="btn btn-default"  @click="onDownloadFile(filename)">DownLoad</button>
            <button class="btn btn-default"  @click="onDeleteFile(filename)">Delete</button>
          </li>      
      </ul>

    </section>



    <section>
      <h1>My Group</h1>
      <input type="text" v-model="group_text">
      <button class="btn btn-default" @click="onNewGroupClick()">New Group</button>
      <div class="container" v-for="(group, group_index) in user_group">
        <h1>{{ group_index }} {{ group[1].group_name }}</h1>
        <h3>{{ group[1].description }}</h3>
        <h5>Members</h5>
        <ul>
          <li v-for="(member, member_index) in group[1].members">
            {{ group_member[[group[0], member]] }}
          </li>
        </ul>
        <input type="text" id="member_input" v-model="member_text"><button class="btn btn-default" @click="onAddMemberClick(group[0])">Add Member</button>
        <button class="btn btn-default" @click="onLeaveGroupClick(group[0])">Leave Group</button>
      </div>
  
    </section>

    <section id="file_management">
      <label for="file_title">Title</label><input type="text" id="file_title"><br>
      <label for="file_description">Description</label><input type="text" id="file_description"><br>
      <label for="file_tag">Tags</label><span class="badge bg-info text-dark">...</span> --- multi select<br>
      <input id="file_upload" type="file" multiple @change="onUploadChange">&nbsp;<button class="btn btn-default" @click="onUploadSubmit">Submit</button>
    </section> -->
    <input id="file_upload" type="file" multiple @change="onUploadChange">&nbsp;<button class="btn btn-default" @click="onUploadSubmit">Submit</button>
</template>

<style scoped>
.btn-circle.btn-xl {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  text-align: center;
}

.close-image {
  width: 100px;
  height: 100px;
  border-radius: 100px;
}

.btn-disabled{
  opacity: 1;
  cursor: default;
}

.thispage {
  font-variation-settings:
  'FILL' 1,
  'wght' 700,
  'GRAD' 0,
  'opsz' 48
}

.underline {
  text-decoration-line: underline;
  text-decoration-thickness: 8px;
  text-decoration-color: #ffd200;
}

</style>

