<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default {
    name: 'LogIn',
    data() {
        return {

        }
    },
    methods: {
        LoginwithGoogle() {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result)
                    const token = credential.accessToken
                    console.log("Token: "+ token)
                    const user = result.user
                    console.log("User: "+ user)
                    console.log(credential,result)
                    this.$router.replace("/home")
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    const email = error.customData.email
                    const credential = GoogleAuthProvider.credentialFromError(error)
                })
        }
    }
}
</script>

<template>
<body>
    <nav class="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-2" id="mainNav">
        <div class="container"><a class="navbar-brand d-flex align-items-center"><RouterLink to="/"><img src="/src/assets/img/Logo-SheetShare.png" width="40" height="40" alt="icon"><span> SheetShare</span></RouterLink></a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item"><RouterLink to="/"><a class="nav-link">Home</a></RouterLink></li>
                    <li class="nav-item"><RouterLink to="/contact"><a class="nav-link">Contacts</a></RouterLink></li>
                </ul><RouterLink to="/login"><a class="btn btn-primary shadow" role="button">Login</a></RouterLink>
            </div>
        </div>
    </nav>
    <section class="py-4 py-md-5 my-5">
        <div class="container py-md-5">
            <div class="row">
                <div class="col-md-6 text-center"><img class="img-fluid w-100" src="../assets/img/login.svg"></div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-xxl-6 text-center text-md-start" style="align-self: center;">
                    <h2 class="display-6 fw-bold mb-5" style="text-align: center;"><span class="underline pb-1"><strong>Login</strong><br></span></h2>
                        <div class="mb-3"></div>
                        <div class="mb-3"></div>
                        <div class="mb-5" style="display: grid;">
                            <button class="btn btn-outline-dark p-3" @click="LoginwithGoogle">
                                <span class="icon"><img class="img-fluid" src="../assets/img/GoogleLogo.png"></span>
                                <span style="text-align: center;">Continue with Google</span>
                            </button>
                        </div>
                </div>
            </div>
        </div>
    </section>
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
</body>
</template>

<style scoped>
.underline {
  text-decoration-line: underline;
  text-decoration-thickness: 8px;
  text-decoration-color: #ffd200;
}
span.icon {
      background: transparent 5px 50% no-repeat;
      display: inline-block;
      width: 25px;
      height: 25px;
      margin-right: 30px;
    }
</style>