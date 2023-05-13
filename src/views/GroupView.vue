<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, doc, getFirestore, updateDoc, Timestamp, setDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import VueMultiselect  from 'vue-multiselect'


export default {
    name: 'Profile',
    components: {
      VueMultiselect 
    },
    data() {
        return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        user_group:[],
        group_text:"",
        group_member:{},
        member_text:"",
        selected_group:{},
        user_opt:[],
        selected_user:[]
        }
    },
    beforeMount () {
        const db = getFirestore()
        const colRef = collection(db,'user')
        onSnapshot(colRef, async snapShot => {
            const current_user = this.auth.currentUser
            this.user_opt = snapShot.docs.map(doc => doc.data())
            console.log(this.user_opt)
            const exist_user = snapShot.docs.map(doc => [doc.id,doc.data()] ).filter(f => f[1].user_id == current_user.uid)
            this.userId = exist_user[0][0]
            this.user = exist_user[0][1]
            const groupColRef = collection(db,"group")
            onSnapshot(groupColRef, (snapShot) => 
            {
              this.user_group = snapShot.docs.map(doc => [doc.id,doc.data()]).filter(f => this.user.group_id.includes(f[0]))
              for (let index = 0; index < this.user_group.length; index++) {
                const target_group_members_id = this.user_group[index][1].members
                target_group_members_id.forEach(async id => {
                  const queryCondition = query(collection(db,"user"), where("user_id","==",id))
                  const target_user = await getDocs(queryCondition)
                  try{
                    const group_key = this.user_group[index][0]
                    const user_key = id
                    this.group_member[[group_key,user_key]] = target_user.docs[0].data().display_name
                  }
                  catch(e){

                  }
                  
                  // [this.user_group[index][0]][id] = target_user.docs[0].data().display_name
                  // this.group_member[this.user_group[index][0]][id] == undefined ? [target_user.docs[0].data().display_name] : this.group_member[this.user_group[index][0]].concat(target_user.docs[0].data().display_name)
                });
              }
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
                window.location.reload();
            })
            .catch((error)=>{
                alert(error.message)
            })
    },
    refreshpage () {
        window.location.reload();
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
          members:[this.user.user_id],
          comments:[]
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
      if(groupDataObj.members.length == 0){
        await deleteDoc(groupDocRef)
      }
      else
      {
        await updateDoc(groupDocRef, groupDataObj)
      }
      this.selected_group = {}
      

      const docRef = doc(db,"user/"+this.userId)
      var arr_id = []
      arr_id = arr_id.concat(this.user.group_id)
      const dataObj = {
        group_id: arr_id.filter(f => f!=group_id)
      }
      await updateDoc(docRef, dataObj)

      
    },
    async onAddMemberClick(group_key){
      const db = getFirestore()
      console.log(this.selected_user)
      const queryCondition = query(collection(db,"user"), where("user_id","in",this.selected_user.map(user => user.user_id)))
      const target_users = await getDocs(queryCondition)
      if(target_users.empty){
        alert("user not found.")
      }
      else
      {
        const groupDocRef = doc(db,"group/"+group_key)
        var arr_member_id = []
        console.log(this.user_group.find(f => f[0] == group_key))
        arr_member_id = arr_member_id.concat(this.user_group.find(f => f[0] == group_key)[1].members)

        target_users.forEach(async user => {
          arr_member_id = arr_member_id.concat(user.data().user_id)
        });
        const dataObj = {
          members:arr_member_id
        }
        await updateDoc(groupDocRef, dataObj)
        
        target_users.forEach(async user => {
          const userDocRef = doc(db,"user/"+user.id)
          var arr_group_id = []
          arr_group_id = arr_group_id.concat(user.get("group_id"))
          const userDataObj = {
            group_id: arr_group_id.concat(groupDocRef.id)
          }
          await updateDoc(userDocRef, userDataObj)
        })
      }
      this.selected_user = []
      window.location.reload()
    },
    onGroupSelect(group){
      this.selected_group = group
    }
    }
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
                                    <span class="material-symbols-outlined mx-2">home</span>
                                    Home
                                  </RouterLink>
                                </li>
                                <li class="list-group-item">
                                  <RouterLink to="/explore">
                                    <span class="material-symbols-outlined mx-2">explore</span>
                                    explore
                                  </RouterLink>
                                </li>
                                <li class="list-group-item">
                                  <RouterLink to="/group">
                                    <span class="material-symbols-outlined mx-2 thispage">group</span>
                                    <span class="underline"><strong>Group</strong></span>
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
                      <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop-logout">
                          <div class="row justify-content-center align-items-center g-2">
                            <div class="col-3 text-end"><span class="material-symbols-outlined">exit_to_app</span></div>
                            <div class="col-9 text-center"><span>Logout</span></div>
                          </div>
                      </button>
                    </div>

                    <br>
                    <div class="mt-5 mb-5"></div>

                  </div>
                </div>

                <div class="col-md-9">
                  <section>
                    <h1>My Group</h1>
                    <input type="text" v-model="group_text">
                    <button class="btn btn-default" @click="onNewGroupClick()">New Group</button>
                    
                
                  </section>
                    <div class="row" style="height: 100vh;">
                        <div class="col-md-3 border-end" style="height: 100vh; overflow-y: scroll;">
                            ตรงนี้จะเป็นรายชื่อกลุ่มที่ผู้ใช้อยู่<br>
                            <div class="list-group">
                              <button v-for="(group, group_index) in user_group" @click="onGroupSelect(group)" class="list-group-item list-group-item-action list-group-item-light">{{ group[1].group_name }}</button>
                            </div>
                        </div>
                        <div class="col-md-9" style="height: 100vh; overflow-y: scroll;" v-if="selected_group[1] != undefined">
                            ตรงนี้จะแสดงไฟล์ที่เอามากองรวมกันและคอมเม้นต์นะกั๊บ
                            <h1>{{ selected_group[1].group_name }}</h1>
                            <h3>{{ selected_group[1].description }}</h3>
                            <h3>Members</h3>
                            <ul>
                              <li v-for="(member, member_index) in selected_group[1].members">
                                {{ group_member[[selected_group[0], member]] }}
                              </li>
                            </ul>
                            <h3>Materials</h3>
                            <ul>
                              <li v-for="(material, member_index) in selected_group[1].materials">
                                {{ material }}
                              </li>
                            </ul>

                            <VueMultiselect
                            v-model="selected_user"
                            :options="user_opt.filter(opt => !selected_group[1].members.includes(opt.user_id))"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            :preserve-search="true"
                            placeholder="Select User"
                            label="display_name"
                            track-by="identifier_email"
                            >
                            <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length }} options selected</span></template>
                          </VueMultiselect>
                            

                          
                            <button class="btn btn-default" @click="onAddMemberClick(selected_group[0])">Add Member</button>
                            <button class="btn btn-default" @click="onLeaveGroupClick(selected_group[0])">Leave Group</button>
                        </div>
                    </div>
                            <footer>
                                <div class="container py-4 py-lg-5">
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

    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 underline" id="staticBackdropLabel"><strong>Reset Avatar</strong></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to reset your avatar to the default?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" @click="resetavatar">Reset Avatar</button>
              </div>
            </div>
          </div>
    </div>

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

    <div class="modal fade" id="staticBackdrop-cancel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 underline" id="staticBackdropLabel"><strong>Cancel Confirmation</strong></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to cancel? Any unsaved progress will be lost.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" @click="refreshpage">Yes</button>
              </div>
            </div>
          </div>
    </div>
    
</body>
</template>

<style scoped>

body {
    font-family: 'Chakra Petch', sans-serif;
}

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
  object-fit: cover;
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

.btn-circle.btn-xl-edit {
  width: 170px;
  height: 170px;
  border-radius: 170px;
  text-align: center;
}

.close-image-edit {
  width: 170px;
  height: 170px;
  border-radius: 170px;
  object-fit: cover;
}

  input:required:valid {
    background-image: url("data:image/svg+xml,<svg viewBox='0 0 16 16' fill='%23198754' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z' clip-rule='evenodd'/></svg>");
    background-position: right 1em center;
    background-repeat: no-repeat;
    background-size: 1.5rem 1.5rem;
  }

</style>