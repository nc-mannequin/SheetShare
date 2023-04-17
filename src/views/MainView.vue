<script>
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'

export default {
  name: 'MainPage',
  data () {
    return {
        auth: getAuth(), isLoggedIn: false
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
    }
  }
}
</script>

<template>
<h1>This is the MAIN PAGE!</h1>
<button class="btn btn-default"  @click="logout">Logout</button>
</template>

<style scoped>


</style>

