<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection,onSnapshot, doc, getFirestore, setDoc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore'


export default{
  name: 'MainPage',
  data () {
    return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        file:{},
        group_text:"",
        user_group:[],
        own_materials:[]
    }
  },
  mounted () {
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
          photo_url:"https://picsum.photos/200/300",
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
        }
      })
      const materialColRef = collection(db,"material")
      onSnapshot(materialColRef,(snapShot) => {
        this.own_materials = snapShot.docs.map(doc => [doc.id,doc.data()]).filter(f => this.user.own_materials_id.includes(f[0]))
      })
    },(err)=>{console.log(err)})

    

    onAuthStateChanged(this.auth, (user) => {
            if(user) {
                this.isLoggedIn= true
            } else {
                this.isLoggedIn= false
            }
        })
    
    
    
  },
  methods: {
    logout () {
      console.log('logout')
      signOut(this.auth) 
            .then (()=>{
                this.$router.replace('/login')
            })
            .catch((error)=>{
                alert(error.message)
            })
    },
    onDownloadFile(path){
      // Create a reference to the file we want to download
      const storage = getStorage();
      const starsRef = ref(storage, path);
      getDownloadURL(starsRef)
      .then((url)=>{
        console.log(url)
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
      for (let index = 0; index < this.file.length; index++) {
        const afile = this.file[index];

        if(afile.name!=undefined){
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
            description:"",
            file_url:snapshot.metadata.fullPath,
            level:"test",
            likes:[],
            subject:"test",
            tags:[],
            title:snapshot.metadata.fullPath.slice(42),
            user_id:this.user.user_id
          }
          await setDoc(materialDocRef, materialDataObj)

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
      document.getElementById("file_upload").value = ""
      
    },
    async onDeleteFile(url){
      const db = getFirestore()
      const docRef = doc(db,"user/"+this.userId)
      var arr_id = []
      arr_id = arr_id.concat(this.user.own_materials_id)
      const dataObj = {
        own_materials_id: arr_id.filter(f => f!=url)
      }
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
    }
    

      
  },
  
}
</script>

<template>
<h1>This is the MAIN PAGE!</h1>
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
  <div class="container" v-for="group in user_group">
    <h1>{{ group[1].group_name }}</h1>
    <h3>{{ group[1].description }}</h3>
    <h5>Members</h5>
    <ul>
      <li v-for="member in group[1].members">
        {{ member }}
      </li>
    </ul>
    <button class="btn btn-default" @click="onLeaveGroupClick(group[0])">Leave Group</button>
  </div>
  
</section>

<section id="file_management">
  <label for="file_title">Title</label><input type="text" id="file_title"><br>
  <label for="file_description">Description</label><input type="text" id="file_description"><br>
  <label for="file_tag">Tags</label><span class="badge bg-info text-dark">...</span> --- multi select<br>
  <input id="file_upload" type="file" multiple @change="onUploadChange">&nbsp;<button class="btn btn-default" @click="onUploadSubmit">Submit</button>
</section>
<button class="btn btn-default"  @click="logout">Logout</button>
</template>

<style scoped>


</style>

