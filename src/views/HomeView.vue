<script>
export default {
    name: 'Home',
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>

<template>
<body>
  <nav class="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-2" id="mainNav">
        <div class="container"><a class="navbar-brand d-flex align-items-center"><RouterLink to="/"><img src="/src/assets/img/Logo-SheetShare.png" width="40" height="40" alt="icon"><span> SheetShare</span></RouterLink></a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item"><RouterLink to="/"><a class="nav-link active">Home</a></RouterLink></li>
                    <li class="nav-item"><RouterLink to="/contact"><a class="nav-link">Contacts</a></RouterLink></li>
                </ul><RouterLink to="/login"><a class="btn btn-primary shadow" role="button">Login</a></RouterLink>
            </div>
        </div>
    </nav>
    <header class="pt-5">
        <div class="container pt-4 pt-xl-5">
            <div class="row pt-5">
                <div class="col-md-8 text-center text-md-start mx-auto">
                    <div class="text-center">
                        <h1 class="display-4 fw-bold mb-5" style="font-family: Raleway, sans-serif;">Empower Online Education with&nbsp;<span class="underline">SheetShare</span>.</h1>
                        <p class="fs-5 text-muted mb-5">Collaborative platform and extensive library of educational resources.</p>
                        <form class="d-flex justify-content-center flex-wrap" method="post">
                            <div class="shadow-lg mb-3"></div>
                            <div class="shadow-lg mb-3"></div>
                        </form>
                    </div>
                </div>
                <div class="col-12 col-lg-10 mx-auto">
                    <div class="text-center position-relative"><img class="img-fluid" src="../assets/img/meeting.svg" style="width: 800px;"></div>
                </div>
            </div>
        </div>
    </header>
    <section>
        <div class="container py-4 py-xl-5">
            <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                <div class="col">
                    <div class="card border-light border-1 d-flex justify-content-center p-4">
                        <div class="card-body">
                            <div class="bs-icon-lg bs-icon-rounded bs-icon-secondary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-4 bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-file-upload">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                    <line x1="12" y1="11" x2="12" y2="17"></line>
                                    <polyline points="9 14 12 11 15 14"></polyline>
                                </svg></div>
                            <div>
                                <h4 class="fw-bold">Sharing</h4>
                                <p class="text-muted" style="font-size: 16px;text-align: left;">Unleash your creativity and share your knowledge through customized worksheets, exams, or study notes.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card border-light border-1 d-flex justify-content-center p-4">
                        <div class="card-body">
                            <div class="bs-icon-lg bs-icon-rounded bs-icon-secondary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-4 bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-school">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                                    <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
                                </svg></div>
                            <div>
                                <h4 class="fw-bold">Connecting</h4>
                                <p class="text-muted" style="font-size: 16px;">Connect and learn from a variety of learning materials, and engage in meaningful discussions with other members of the community.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card border-light border-1 d-flex justify-content-center p-4">
                        <div class="card-body">
                            <div class="bs-icon-lg bs-icon-rounded bs-icon-secondary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-4 bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-social">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <circle cx="12" cy="5" r="2"></circle>
                                    <circle cx="5" cy="19" r="2"></circle>
                                    <circle cx="19" cy="19" r="2"></circle>
                                    <circle cx="12" cy="14" r="3"></circle>
                                    <line x1="12" y1="7" x2="12" y2="11"></line>
                                    <line x1="6.7" y1="17.8" x2="9.5" y2="15.8"></line>
                                    <line x1="17.3" y1="17.8" x2="14.5" y2="15.8"></line>
                                </svg></div>
                            <div>
                                <h4 class="fw-bold">Grouping</h4>
                                <p class="text-muted" style="font-size: 16px;">Create study groups and collaborate with other users. Easily share learning materials within the group and work together to achieve your goals!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container py-4 py-xl-5">
            <div class="row gy-4 gy-md-0">
                <div class="col-md-6 text-center text-md-start d-flex d-sm-flex d-md-flex justify-content-center align-items-center justify-content-md-start align-items-md-center justify-content-xl-center">
                    <div style="max-width: 350px;">
                        <h1 class="display-6 fw-bold mb-4"><span class="underline">Everyone</span> deserves the&nbsp;chance to learn.</h1>
                        <p class="my-4">Join us in creating a community where knowledge is freely shared and easily accessible, because together, we can make a difference in empowering education for all.</p>
                        <RouterLink to="/login"><a class="btn btn-primary shadow" role="button" style="display: grid;">Login</a></RouterLink>
                    </div>
                </div>
                <div class="col-md-6">
                    <div><img class="rounded img-fluid w-100 fit-cover" style="min-height: 300px;" src="../assets/img/teamwork.svg"></div>
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


</style>

