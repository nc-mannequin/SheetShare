<script>
export default {
    name: 'Contacts',
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
    <nav class="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-3" id="mainNav">
        <div class="container"><a class="navbar-brand d-flex align-items-center"><RouterLink to="/"><img src="/src/assets/img/Logo-SheetShare.png" width="40" height="40" alt="icon"><span> SheetShare</span></RouterLink></a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item"><RouterLink to="/"><a class="nav-link">Home</a></RouterLink></li>
                    <li class="nav-item"><RouterLink to="/contact"><a class="nav-link active">Contacts</a></RouterLink></li>
                </ul><RouterLink to="/login"><a class="btn btn-primary shadow" role="button">Login</a></RouterLink>
            </div>
        </div>
    </nav>
    <section class="pt-5 mt-5">
        <div class="container pt-5">
            <div class="row">
                <div class="col-sm-11 col-md-8 col-xl-6 col-xxl-8 text-center mx-auto">
                    <h1 class="display-6 fw-bold mb-4">Got Any <span class="underline">Questions</span>?</h1>
                    <p class="text-muted">Our team is always here to help. Send us a message and we'll get back to you shortly.</p>
                </div>
            </div>
            <div class="row d-flex justify-content-center">
                <div class="col-md-6">
                    <div></div>
                </div>
            </div>
            <div class="row d-flex justify-content-center">
                <div class="col-md-6" style="padding-top: 30px;">
                    <div></div>
                    <h2 class="display-6 fw-bold mb-4" style="text-align: center;padding-top: 10px;font-size: 32px;"><span class="underline">SheetShare</span>&nbsp;Team</h2>
                    <p class="text-muted" style="font-size: 16px;text-align: center;font-weight: bold;">sheetshare.team@gmail.com</p>
                    <p class="text-muted" style="font-size: 12px;text-align: center;">EGCO427&nbsp;Web Programming<br>Computer Engineering, Mahidol University</p>
                </div>
            </div>
        </div>
    </section>
    <section class="py-4 py-xl-5 mb-5">
        <div class="container">
            <div class="row mb-2">
                <div class="col-md-8 col-xl-6 text-center mx-auto">
                    <h2 class="display-6 fw-bold mb-5"><span class="pb-3 underline">FAQ<br></span></h2>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-8 mx-auto">
                    <div class="accordion text-muted" role="tablist" id="accordion-1">
                        <div class="accordion-item">
                            <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-1" aria-expanded="false" aria-controls="accordion-1 .item-1">What is SheetShare?</button></h2>
                            <div class="accordion-collapse collapse item-1" role="tabpanel" data-bs-parent="#accordion-1">
                                <div class="accordion-body">
                                    <p>SheetShare is an online platform designed to facilitate the sharing and collaboration of educational resources.</p>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-2" aria-expanded="false" aria-controls="accordion-1 .item-2">Can I upload my own educational resources to SheetShare?</button></h2>
                            <div class="accordion-collapse collapse item-2" role="tabpanel" data-bs-parent="#accordion-1">
                                <div class="accordion-body">
                                    <p class="mb-0">Yes, you can! SheetShare allows all users to create and upload their own educational resources such as worksheets, exams, or study notes.</p>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-3" aria-expanded="false" aria-controls="accordion-1 .item-3">Can I collaborate with other users on SheetShare?</button></h2>
                            <div class="accordion-collapse collapse item-3" role="tabpanel" data-bs-parent="#accordion-1">
                                <div class="accordion-body">
                                    <p class="mb-0">Yes, you can! SheetShare offers study groups and other collaboration features that allow users to work together on educational resources.</p>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-4" aria-expanded="false" aria-controls="accordion-1 .item-4">Is SheetShare suitable for all grade levels?</button></h2>
                            <div class="accordion-collapse collapse item-4" role="tabpanel" data-bs-parent="#accordion-1">
                                <div class="accordion-body">
                                    <p class="mb-0">Yes, SheetShare is suitable for all grade levels, from kindergarten to high school. Our platform offers a wide range of educational resources that can be customized to fit the needs of different age groups and subject areas.</p>
                                </div>
                            </div>
                        </div>
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


</style>