<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, doc, getFirestore, updateDoc, Timestamp } from 'firebase/firestore'

export default {
    name: 'Profile',
    data() {
        return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        display_name_text:"",
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
                    '   <button type="button" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>',
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
            appendAlert('error', 'Invalid Display Name', 'Display names can only contain English and Thai letters, numbers, spaces, hyphens, underscores, periods, or single spaces between words.', 'Please try again with a valid display name, or click on the cancel button to abort the operation.', 'danger')
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
                  <div style="position: sticky; top: 120px;">
                    <div class="card border-0">
                        <div class="card-body">
                        <div class="text-center">
                          <h6><strong>{{ user.display_name }}</strong></h6>
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
                                  <RouterLink :to="{ name: 'profile', params: { userId: userId } }">
                                    <span class="material-symbols-outlined mx-2 thispage">person</span>
                                    <span class="underline"><strong>Profile</strong></span>
                                  </RouterLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="text-center mt-2">
                              <button type="button" class="btn btn-outline-danger" @click="logout">Logout</button>
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
                                    <div class="card border-0">
                                        <div class="card-body">
                                            <div>
                                                <div v-if="user?.photo_url != ''">
                                                    <img :src=user.photo_url alt="user_img" class="close-image-edit">
                                                </div>
                                                <div v-else>
                                                    <button class="btn btn-primary shadow btn-circle btn-xl-edit btn-disabled"><h1 class="mt-2">{{ user?.display_name ? user.display_name.charAt(0) : "" }}</h1></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="input-group px-3">
                                            <input type="file" class="form-control" id="inputGroupFile01">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="text-end mt-2 pe-3">
                                            <button type="button" class="btn btn-danger btn-sm mx-2">Reset</button>
                                            <button type="button" class="btn btn-primary shadow btn-sm">Upload</button>
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
                                            <button type="button" class="btn btn-danger btn-sm mx-2" @click="refreshpage">Cancle</button>
                                            <button type="button" class="btn btn-primary shadow btn-sm" @click="onSaveClick">Save</button>
                                </div>
                            </div>
                </div>
          </div>
        </div>
    </section>
    <footer>
        <div class="container py-2 py-lg-3">
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
</body>
</template>

<style scoped>

.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  border-radius: 70px;
  text-align: center;
}

.close-image {
  width: 70px;
  height: 70px;
  border-radius: 70px;
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
  width: 200px;
  height: 200px;
  border-radius: 200px;
  text-align: center;
}

.close-image-edit {
  width: 200px;
  height: 200px;
  border-radius: 200px;
}

</style>

