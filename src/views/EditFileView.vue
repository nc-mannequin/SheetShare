<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection,onSnapshot, doc, getFirestore, setDoc, updateDoc, deleteDoc, Timestamp, getDoc, getDocs, query, where } from 'firebase/firestore'
import VuePdfEmbed from 'vue-pdf-embed'
import axios from 'axios';

export default {
    name: 'EditFile',
    components: {
        VuePdfEmbed,
    },
    data() {
        return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        display_name_text:"",
        file:{},
        master_data:{},
        page: 1,
        pageCount: 1,
        joke: "",
        }
    },
    beforeMount () {
        onAuthStateChanged(this.auth, (user) => {
            if(user) {
                this.isLoggedIn= true
            } else {
                this.isLoggedIn= false
            }
        })
        const db = getFirestore()
        const colRef = collection(db,'user')
        onSnapshot(colRef, async snapShot => {
            const current_user = this.auth.currentUser
            const exist_user = snapShot.docs.map(doc => [doc.id,doc.data()] ).filter(f => f[1].user_id == current_user.uid)
            this.userId = exist_user[0][0]
            this.user = exist_user[0][1]

            const docRef = doc(db,"material/"+this.$route.params.file_doc_ref)
            await getDoc(docRef)
            .then((result) => {
                this.file = result.data()
                const storage = getStorage();
                const fileRef = ref(storage, this.file.file_url);
                getDownloadURL(fileRef).then((url) => {
                    this.file.source = url
                    console.log(this.file)
                })
            })


        },(err)=>{console.log(err)})

        const MasterDataColRef = collection(db,"master_data")
        onSnapshot(MasterDataColRef
        ,(snapShot) => {
        this.master_data = snapShot.docs.map(doc => doc.data())
        }
        ,(err) => {console.log(err)})

        // ======================================= getDadJoKe ======================================

    axios.get('https://icanhazdadjoke.com/', { headers: { "Accept": "text/plain" } })
        .then((res) => {
          console.log(res)
          this.joke = res.data
        })
        .catch((err) => {
          console.log(err)
        })

    // =============================================================================

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
    onReloadClick(){
        window.location.reload()
    },
    async onSaveClick(){
        const db = getFirestore()
        const docRef = doc(db,"material/"+this.$route.params.file_doc_ref)
        await updateDoc(docRef,this.file)
        window.location.reload()
    },
    loadedDocument() {
      this.pageCount = this.$refs.pdfRef.pageCount
    },
    async onDeleteFile(){
      const docRefId = this.$route.params.file_doc_ref
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
      await updateDoc(docRef, dataObj)
      
      const materialDocRef = doc(db,"material/"+docRefId)
      await deleteDoc(materialDocRef)
      this.$router.replace('/home')
      window.location.reload();
    },

        // ===============================================================================================================

     async fetchJoke() {
      axios.get('https://icanhazdadjoke.com/', { headers: { "Accept": "text/plain" } })
        .then((res) => {
          console.log(res)
          this.joke = res.data
        })
        .catch((err) => {
          console.log(err)
        })
  },
  
  // ===============================================================================================================
    
    
    
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
                                    Explore
                                  </RouterLink>
                                </li>
                                <li class="list-group-item">
                                  <RouterLink to="/group">
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

                    <div class="row mx-4 mt-2">
                      <h6><strong><span style="text-decoration-line: underline; text-decoration-thickness: 5px; text-decoration-color: #ffd200;">Short Joke for YOU!</span></strong></h6>
                      <p><em>&nbsp; {{ joke }}</em></p>
                    </div>
                    <div class="row mx-4">
                      <button type="button" class="btn btn-primary btn-sm" style="--bs-btn-font-size: 0.75rem;" @click="fetchJoke()">
                            <div class="text-center justify-content-center align-items-center"><span class="material-symbols-outlined me-2" style="font-size: 1.15rem;">shuffle</span><span>New Joke</span></div>
                      </button>
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
                    <div class="row mt-3">
                        <h2><span class="underline"><span class="material-symbols-outlined mx-2 thispage">edit</span>Edit Material</span></h2>
                    </div>
                    <div class="row mt-3">
                        <div class="btn-group" role="group">
                            <router-link to="/home" tag="button" class="btn btn-outline-primary p-3 border border-1"><span><span class="material-symbols-outlined mx-2">home</span>Back to Home</span></router-link>
                            <router-link to="/explore" tag="button" class="btn btn-outline-primary p-3 border border-1"><span><span class="material-symbols-outlined mx-2">explore</span>Back to Explore</span></router-link>
                        </div>
                    </div>


                      <div class="row my-3 mx-3">
                        <div class="col-md-6">
                          <div v-if="file.source != undefined">
                            <div id="app">
                              <div class="app-header text-center py-3">
                                  <span>
                                    <button :disabled="page <= 1" @click="page--" class="mx-3 btn btn-primary btn-sm">❮</button>
                                    {{ page }} / {{ pageCount }}
                                    <button :disabled="page >= pageCount" @click="page++" class="mx-3 btn btn-primary btn-sm">❯</button>
                                  </span>
                              </div>
                              <div class="app-content p-2" style="background-color: #ccc;">
                                <vue-pdf-embed
                                ref="pdfRef"
                                :source="file.source"
                                :page="page"
                                @loaded="loadedDocument"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row mt-2">
                            <div class="btn-group" role="group">
                                <a :href=file.source target="_blank" rel="noopener noreferrer"><button type="button" class="btn btn-dark"><span class="material-symbols-outlined me-2 thispage">open_in_new</span>Preview in New Tab</button></a>
                                <button type="button" class="btn btn-success"><span class="material-symbols-outlined mx-2 thispage">download</span>Download</button>
                            </div>
                        </div>
                        </div>
                        <div class="col-md-6">
                          <form class="mx-3">
                                <div class="row g-1 mt-2">
                                    <label for="validationDefault01" class="form-label"><strong>Title</strong></label>
                                    <input type="text" class="form-control" id="validationDefault01" name="title" v-model="file.title" disabled readonly>
                                </div>
                                <div class="row g-1 mt-4">
                                  <label for="levelDropdown" class="form-label"><strong>Level<span class="text-danger">*</span></strong></label>
                                  <div class="input-group">
                                    <select class="form-select" id="levelDropdown" :placeholder=file.level v-model="file.level">
                                      <option v-for="level in this.master_data.length > 0 ? this.master_data.find(opt => opt.option_name == 'level').options : []" :value=level>{{ level }}</option>
                                    </select>
                                  </div>
                                </div>
                                <div class="row g-1 mt-4">
                                  <label for="subjectDropdown" class="form-label"><strong>Subject<span class="text-danger">*</span></strong></label>
                                  <div class="input-group">
                                    <select class="form-select mb-1" id="subjectDropdown" :placeholder=file.subject v-model="file.subject">
                                      <option v-for="subject in this.master_data.length > 0 ? this.master_data.find(opt => opt.option_name == 'subject').options : []" :value=subject>{{ subject }}</option>
                                    </select>
                                  </div>
                                </div>
                                <div class="row g-1 mt-4">
                                  <label for="descriptionTextarea" class="form-label"><strong>Description</strong></label>
                                  <div class="input-group">
                                    <textarea class="w-100" id="descriptionTextarea" rows="3" :placeholder=file.description v-model="file.description"></textarea>
                                  </div>
                                </div>
                          </form>
                          <div class="row">
                                <div class="text-center mt-4">
                                  <button type="button" class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop-cancel">Cancel</button>
                                  <button type="button" class="btn btn-primary shadow btn-sm" @click="onSaveClick">Save</button>
                                </div>
                          </div>
                          <div class="row">
                            <div class="text-center mt-4 d-grid gap-2">
                              <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop-delete">Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
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
                <button type="button" class="btn btn-danger" @click="onReloadClick">Yes</button>
              </div>
            </div>
          </div>
    </div>

    <div class="modal fade" id="staticBackdrop-delete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 underline" id="staticBackdropLabel"><strong>Delete Material Confirmation</strong></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this material? Once deleted it cannot be recovered.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" @click="onDeleteFile">DELETE</button>
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


.app-header {
  background-color: #ffd200;
  color: #2d2d2d;
}

</style>

