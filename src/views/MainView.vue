<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

export default{
  name: 'MainPage',
  data () {
    return {
        auth: getAuth(), 
        isLoggedIn: false
    }
  },
  mounted () {
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
        console.log(url)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    testUpload(event){
      const storage = getStorage();
      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, 'Test');
      console.log(event)
      const file = event.target.files[0]
      console.log(file)
      uploadBytes(storageRef, file, metadata)
      .then((snapshot)=>{
        console.log(snapshot)
      })
    }

      
  }
}
</script>

<template>
<h1>This is the MAIN PAGE!</h1>
<button class="btn btn-default"  @click="logout">Logout</button>
<button class="btn btn-default"  @click="testDownload">DownLoad</button>
<input type="file" @change="testUpload">Upload
</template>

<style scoped>


</style>

