<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection,onSnapshot, doc, getFirestore, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'


export default{
  name: 'MainPage',
  data () {
    return {
        auth: getAuth(), 
        isLoggedIn: false,
        userId:"",
        user:{},
        file:{}
    }
  },
  mounted () {
    const db = getFirestore()
    const colRef = collection(db,'user')
    onSnapshot(colRef, async snapShot => {
      const current_user = this.auth.currentUser
      const exist_user = snapShot.docs.map(doc => [doc.id,doc.data()] ).filter(f => f[1].user_id == current_user.uid)
      console.log(exist_user)
      
      const docRef = doc(collection(db,"user"))
      if(exist_user.length == 0){
        const dataObj = {
          created_at: Timestamp.now(),
          display_name:current_user.displayName,
          fav_materials_id:[],
          identifier_email:current_user.email,
          own_materials_id:[],
          photo_url:"https://picsum.photos/200/300",
          updated_at:Timestamp.now(),
          user_id:current_user.uid
        }
        const insertRef = await setDoc(docRef, dataObj)
        console.log(insertRef)
        this.user = insertRef
      }
      else
      {
        console.log(exist_user)
        console.log(exist_user[0])
        this.userId = exist_user[0][0]
        this.user = exist_user[0][1]
      }
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
          console.log(snapshot.metadata.fullPath)
          const db = getFirestore()
          const docRef = doc(db,"user/"+this.userId)
          var arr_id = []
          arr_id = arr_id.concat(this.user.own_materials_id)
          const dataObj = {
            own_materials_id: arr_id.concat(snapshot.metadata.fullPath)
          }
          const updateRef = await updateDoc(docRef, dataObj)
        })
      }
        
      }
      document.getElementById("file_upload").value = ""
      
    }

      
  }
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
      <li v-for="filename in user.own_materials_id">
        {{ filename.slice(42) }} <button class="btn btn-default"  @click="onDownloadFile(filename)">DownLoad</button>
      </li>      
  </ul>
  <br>
  <p>fav material</p>
  <li>
    <ul></ul>
  </li>

</section>
<button class="btn btn-default"  @click="logout">Logout</button>

<input id="file_upload" type="file" multiple @change="onUploadChange">&nbsp;<button class="btn btn-default" @click="onUploadSubmit">Submit</button>
</template>

<style scoped>


</style>

