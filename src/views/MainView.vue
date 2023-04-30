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
        user:{},
    }
  },
  mounted () {
    const db = getFirestore()
    const colRef = collection(db,'user')
    onSnapshot(colRef, async snapShot => {
      const current_user = this.auth.currentUser
      const exist_user = snapShot.docs.map(doc => doc.data()).filter(f => f.user_id == current_user.uid)
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
      }
      else
      {
        console.log(exist_user)
      }

      console.log(this.user)
      
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
    testDownload(){
      // Create a reference to the file we want to download
      const storage = getStorage();
      const starsRef = ref(storage, 'yum.png');
      getDownloadURL(starsRef)
      .then((url)=>{
        this.user_img_url = url
        console.log(url)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    testUpload(event){
      const storage = getStorage();
      
      console.log(event)
      const file = event.target.files[0]
      
      const storageRef = ref(storage, this.user_uid.concat("/",Date.now().toString(),file.name));
      console.log(file)
      uploadBytes(storageRef, file)
      .then((snapshot)=>{
        console.log(snapshot)
      })
    }

      
  }
}
</script>

<template>
<h1>This is the MAIN PAGE!</h1>
<section name="user">
  <!-- <img :src=user_img_url alt="user_img">
  <h1>{{ user }}</h1> -->

</section>
<button class="btn btn-default"  @click="logout">Logout</button>
<button class="btn btn-default"  @click="testDownload">DownLoad</button>
<input type="file" @change="testUpload">
</template>

<style scoped>


</style>

