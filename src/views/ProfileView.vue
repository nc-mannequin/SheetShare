<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, doc, getFirestore, updateDoc, Timestamp } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

export default {
    name: 'Profile',
    data() {
        return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        display_name_text:"",
        edit_display_name_error: false,
        file:{}
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
        },(err)=>{console.log(err)})
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
    async onSaveClick() {
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
        const appendAlert = (icon, messageone, messagetwo, messagethree, type) => {
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-${type}" role="alert">`,
                    `<span><span class="material-symbols-outlined mx-2">${icon}</span><span class="alert-heading h4"><strong>${messageone}</strong></span></span>`,
                    `<p class="my-3">${messagetwo}</p>`,
                    '<hr>',
                    `<p class="mb-0">${messagethree}</p>`,
                    '</div>'
                ].join('')
                
                alertPlaceholder.append(wrapper)
        }

        const display_name_textRGEX = /^[a-zA-Z0-9ก-๙]+([-_. ]?[a-zA-Z0-9ก-๙]+)*$/;
        const display_name_textResult = display_name_textRGEX.test(this.display_name_text);

        if (display_name_textResult == false){
            if (this.edit_display_name_error == false){
                appendAlert('error', 'Invalid Display Name', 'Display names can only contain English and Thai letters, numbers, spaces, hyphens, underscores, periods, or single spaces between words.', 'Please try again with a valid display name (until the check icon appears), or click on the cancel button to abort the operation.', 'danger')
                this.edit_display_name_error = true
            }
            else {

            }
        }
        else{
            const db = getFirestore()
            const docRef = doc(db, "user/"+this.userId)
            const data = {
                display_name: this.display_name_text,
                updated_at: Timestamp.now()
            };

            await updateDoc(docRef, data)
                .then (()=>{
                    window.location.reload();
                })
                .catch((error)=>{
                    alert(error.message)
                })
        }
    },
    async resetavatar() {
        const db = getFirestore()
        const docRef = doc(db, "user/"+this.userId)
        const data = {
                photo_url: "",
                updated_at: Timestamp.now()
        };

        await updateDoc(docRef, data)
                .then (()=>{
                    window.location.reload();
                })
                .catch((error)=>{
                    alert(error.message)
                })
    },
    onProfileImgUpload(event){
      if(event.target.files[0] != null && event.target.files[0] != undefined){
        this.file = event.target.files[0]
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0])
        setTimeout(()=>{
          var target_change = document.getElementById("user_image")
          if(target_change != null){
            document.getElementById("user_image").src = reader.result
          }
          else
          {
            var target_change_if_not_exist = document.getElementById("user_image_default")
            var preview_image = document.createElement("img");
            preview_image.alt = "user_img"
            preview_image.style = "width: 170px; height: 170px; border-radius: 170px; object-fit: cover;"
            preview_image.id = "user_image"
            preview_image.src = reader.result;
            target_change_if_not_exist.childNodes[0].replaceWith(preview_image)  
          }
        },100)
        
      }
    },
    onProfileImgSubmit(){
      const storage = getStorage();
      const url = this.user.user_id.concat("/profile/",Date.now().toString(),this.file.name)
      const storageRef = ref(storage, url);
      uploadBytes(storageRef, this.file)
      .then(async ()=>{
        getDownloadURL(storageRef)
        .then(async (download_url)=>{
          const db = getFirestore()
          const userDocRef = doc(db,"user/"+this.userId)
          const changeDetail = {
            photo_url : download_url
          }
          await updateDoc(userDocRef, changeDetail)
        })
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
                                    <span class="material-symbols-outlined mx-2">library_books</span>
                                    Home
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
                                    <span class="material-symbols-outlined mx-2 thispage">person</span>
                                    <span class="underline"><strong>Profile</strong></span>
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
                    <div class="row mt-3">
                        <h2><span class="underline"><span class="material-symbols-outlined mx-2 thispage">person</span>Profile</span></h2>
                    </div>
                            <div class="row mt-3" style="align-items: center;">
                                <div class="col-md-4 text-center">
                                    <div class="row">
                                        <div class="card border-0">
                                        <div class="card-body">
                                            <div>
                                                <div v-if="user?.photo_url != ''">
                                                    <img :src=user.photo_url alt="user_img" class="close-image-edit" id="user_image">
                                                </div>
                                                <div v-else id="user_image_default">
                                                    <button class="btn btn-primary shadow btn-circle btn-xl-edit btn-disabled"><h1 class="mt-2">{{ user?.display_name ? user.display_name.charAt(0) : "" }}</h1></button>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="text-center mb-5 mt-2">
                                            <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Reset Avatar</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="input-group px-3">
                                            <input type="file" accept="image/png, image/jpeg" class="form-control" id="inputGroupFile01" @change="onProfileImgUpload">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="text-end mt-2 pe-3">
                                            <button type="button" class="btn btn-danger btn-sm mx-2" @click="refreshpage">Cancel</button>
                                            <button type="button" class="btn btn-primary shadow btn-sm" @click="onProfileImgSubmit">Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form class="mx-3">
                                <div class="row g-1 mt-2">
                                    <label for="validationDefault01" class="form-label"><strong>Email</strong></label>
                                    <input type="text" class="form-control" id="validationDefault01" name="email" v-model="user.identifier_email" disabled readonly>
                                </div>
                                <div class="row g-1 mt-4">
                                    <label for="validationDefault02" class="form-label"><strong>Display Name</strong></label>
                                    <input type="text" class="form-control" id="validationDefault02" name="displayname" pattern="^[a-zA-Z0-9ก-๙]+([\-_\. ]?[a-zA-Z0-9ก-๙]+)*$" maxlength="32" :placeholder="[[user.display_name]]" v-model="display_name_text" required>
                                </div>
                            </form>
                            <div class="row mt-4 mx-0" id="liveAlertPlaceholder"></div>
                            <div class="row">
                                <div class="text-center mt-4">
                                            <button type="button" class="btn btn-danger btn-sm mx-2" @click="refreshpage">Cancel</button>
                                            <button type="button" class="btn btn-primary shadow btn-sm" @click="onSaveClick">Save</button>
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
    
</body>
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

