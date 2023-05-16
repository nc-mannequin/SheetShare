<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection,onSnapshot, doc, getFirestore, setDoc, updateDoc, deleteDoc, Timestamp, getDoc, getDocs, query, where } from 'firebase/firestore'
import VuePdfEmbed from 'vue-pdf-embed'
import axios from 'axios';

export default {
    name: 'Material',
    components: {
        VuePdfEmbed,
    },
    data() {
        return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        file:{},
        page: 1,
        pageCount: 1,
        owner:{
            display_name: "",
            photo_url: ""
        },
        joke: "",
        comment_input:""
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

            const owner_user = snapShot.docs.map(doc => [doc.id,doc.data()] ).filter(f => f[1].user_id == this.file.user_id)
            this.owner.display_name = owner_user[0][1].display_name
            this.owner.photo_url = owner_user[0][1].photo_url
            console.log(this.owner)


        },(err)=>{console.log(err)})

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
    loadedDocument() {
      this.pageCount = this.$refs.pdfRef.pageCount
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
  async onLikeClick(){
      const db = getFirestore()
      const currentUserDocRef = doc(db,"user/"+this.userId)
      if(!this.file.likes.map(user => user.id).includes(this.userId)){
        const materialDocRef = doc(db,"material/"+this.$route.params.file_doc_ref)
        var currentLike = this.file.likes
        const changeDetail = {
          likes: currentLike.concat(currentUserDocRef)
        }
        await updateDoc(materialDocRef,changeDetail)
        window.location.reload()
      }
      else
      {
        alert("You already like this shit.")
      }
    },
    async onFavClick(){
      const db = getFirestore()
      const currentUserDocRef = doc(db,"user/"+this.userId)
      var current_fav_materials_id = this.user.fav_materials_id
      if(!current_fav_materials_id.includes(this.$route.params.file_doc_ref)){
        const changeDetail = {
          fav_materials_id:current_fav_materials_id.concat(this.$route.params.file_doc_ref)
        }
        await updateDoc(currentUserDocRef,changeDetail)
        window.location.reload()
      }
      else
      {
        alert("You already fav this shit.")
      }
      
      
    },
    async onCommentEnter(){
      if(this.comment_input.trim().length == 0){
        alert("U sending nothing. idiot.")
      }
      else
      {
        const new_comment = {
          display_name:this.user.display_name,
          identifier_email:this.user.identifier_email,
          created_date:Timestamp.now(),
          img_url:this.user.photo_url,
          msg:this.comment_input
        }
        const db = getFirestore()
        var current_comments = this.file.comments
        current_comments.push(new_comment)
        const changeDetail = {
          comments:current_comments
        }
        const materialDocRef = doc(db,"material/"+this.$route.params.file_doc_ref)
        await updateDoc(materialDocRef,changeDetail)
        this.comment_input= ""
      }
      
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
                            <div class="col-3 text-end me-2"><span class="material-symbols-outlined">logout</span></div>
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
                        <h2><span class="underline"><span class="material-symbols-outlined mx-2 thispage">description</span>Material</span></h2>
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
                                <button type="button" class="btn btn-success" @click="onDownloadFile(file.file_url)"><span class="material-symbols-outlined mx-2 thispage">download</span>Download</button>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop-addgroup"><span class="material-symbols-outlined mx-2 thispage">add</span>Add To Group</button>
                            </div>
                        </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card border-0 my-3">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="text-center">
                                          <div v-if="owner?.photo_url != ''">
                                            <img :src=owner.photo_url alt="user_img" class="close-image">
                                          </div>
                                          <div v-else>
                                            <button class="btn btn-primary shadow btn-circle btn-xl btn-disabled"><h3 class="mt-2">{{ owner?.display_name ? owner.display_name.charAt(0) : "" }}</h3></button>
                                          </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8 d-flex align-items-center justify-content-center">
                                          <div class="card-body">
                                            <div class="text-center">
                                                <h4><strong>{{ owner.display_name }}</strong></h4>
                                                <h6><em>Owner</em></h6>
                                            </div>
                                          </div>
                                    </div>
                                </div>
                            </div>
                          <form class="mx-3">
                                <div class="row g-1 mt-2">
                                    <label for="validationDefault01" class="form-label"><strong>Title</strong></label>
                                    <input type="text" class="form-control" id="validationDefault01" name="title" v-model="file.title" disabled readonly>
                                </div>
                                <div class="row g-1 mt-4">
                                  <label for="levelDropdown" class="form-label"><strong>Level</strong></label>
                                  <input type="text" class="form-control" id="levelDropdown" name="level" v-model="file.level" disabled readonly>
                                </div>
                                <div class="row g-1 mt-4">
                                  <label for="subjectDropdown" class="form-label"><strong>Subject</strong></label>
                                  <input type="text" class="form-control" id="subjectDropdown" name="subject" v-model="file.subject" disabled readonly>
                                </div>
                                <div class="row g-1 mt-4">
                                  <label for="descriptionTextarea" class="form-label"><strong>Description</strong></label>
                                  <div class="input-group">
                                    <textarea class="w-100" id="descriptionTextarea" rows="3" placeholder="No Description" v-model="file.description" disabled readonly></textarea>
                                  </div>
                                </div>
                          </form>

                          <div class="justify-content-center align-items-center g-2 mt-2 text-center">
                            <div class="row">
                                <div class="text-center mt-4">
                                  <button class="mx-1 btn btn-primary btn-sm" @click="onLikeClick">
                                    <span class="material-symbols-outlined align-bottom">thumb_up</span>
                                    <span class="align-text-middle">
                                      Like
                                    </span>
                                  </button>
                                  <button class="mx-1 btn btn-danger btn-sm" @click="onFavClick">
                                    <span class="material-symbols-outlined align-bottom">favorite</span>
                                    <span class="align-text-middle">
                                      Love
                                    </span>
                                  </button>
                                </div>
                            </div>
                            <div class="row">
                              <div class="text-center mt-4">
                                {{ file.likes != undefined ? file.likes.length : 0 }} Liked this material.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="container mt-5">
                        <div class="row mt-3">
                          <h2><span class="underline"><span class="material-symbols-outlined mx-2 thispage">chat</span>Comments</span></h2>
                        </div>
                        <div style="overflow-y: scroll; height: 60vh;">

                          <div v-for="comment in file.comments" class="container my-3 border border-1 border-warning">
                            <div class="row my-3">
                              <div class="col-4 col-md-2 text-center">
                                <img :src=comment.img_url :alt="comment.display_name + 'img'" class="close-image" style="scale: 0.7;"/>
                              </div>
                              <div class="col-8 col-md-7 align-self-center">
                                <div class="row">
                                  <h4><strong> {{ comment.display_name }} </strong></h4>
                                </div>
                                <div class="row">
                                  <h6><small><small>{{ comment.identifier_email }}</small></small></h6>
                                </div>
                              </div>
                              <div class="col-12 col-md-3 align-self-center text-end">
                                <div class="row my-1">
                                  <h6><small>{{ comment.created_date.toDate().toDateString() }}</small></h6>
                                </div>
                                <div class="row my-1">
                                  <h6><small>{{ comment.created_date.toDate().toLocaleTimeString() }}</small></h6>
                                </div>
                              </div>
                            </div>
                            <div class="row my-3">
                                <div class="align-items-center px-4">
                                  {{ comment.msg }}
                                </div>
                              </div>
                          </div>
                        
                        </div>
                        <div class="row mt-3">
                          <h2><span class="underline"><span class="material-symbols-outlined mx-2 thispage">add_comment</span>Add Comment</span></h2>
                        </div>
                        <div class="container my-3 border border-1 border-warning">
                          <div class="row my-3">
                            <div class="col-4 col-md-2 text-center">
                              <div v-if="user?.photo_url != ''">
                                <img :src=user.photo_url alt="user_img" class="close-image" style="scale: 0.5;">
                              </div>
                            </div>
                            <div class="col-8 col-md-7 align-self-center">
                              <div class="row">
                                <h4><strong> {{ user.display_name }} </strong></h4>
                              </div>
                              <div class="row">
                                <h6><small><small>{{ user.identifier_email }}</small></small></h6>
                              </div>
                            </div>
                            <div class="col-12 col-md-3 align-self-center text-end">
                              <div class="row my-1">
                                <h6><small></small></h6>
                              </div>
                              <div class="row my-1">
                                <h6><small></small></h6>
                              </div>
                            </div>
                          </div>
                          <div class="row my-3">
                              <div class="align-items-center px-4">
                                <div class="form-floating">
                                  <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea" v-model="comment_input" v-on:keyup.enter="onCommentEnter()"></textarea>
                                  <label for="floatingTextarea">Comments</label>
                                </div>
                                <h6 class="text-end"><small><small>Please add your comments below and then press enter to submit.</small></small></h6>
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

    <div class="modal fade" id="staticBackdrop-addgroup" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 underline" id="staticBackdropLabel"><strong>&nbsp; Add To Group &nbsp;</strong></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body mb-3">
                <div class="row mt-2 px-1" id="liveAlertPlaceholder-Upload"></div>
                <form class="g-3 needs-validation" novalidate>
                  <label for="groupDropdown" class="form-label"><h5 class="mx-3 text-start"><strong>Select Group</strong><span class="text-danger">*</span></h5></label>
                  <div class="input-group px-3">
                    <select class="form-select mb-1" id="groupDropdown" placeholder="Please select ..." required>
                      <!-- <option v-for=" ">{{  }}</option> -->
                    </select>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Add</button>
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

