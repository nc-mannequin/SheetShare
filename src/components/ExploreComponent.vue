<script>
import VuePdfEmbed from 'vue-pdf-embed'

export default {
    name: 'Explore',
    props: ['file'],
    components: {
        VuePdfEmbed,
    },
    data() {
        return {
        }
    },
    methods:{

    },
}
</script>

<template>
    <div class="col-md-6 col-lg-4 d-flex">
        <div class="card">
            <div class="card-header">
                <vue-pdf-embed :source=file.source :disable-text-layer="true" :page="1" />
            </div>
            <div class="card-body">
                <div class="row text-center my-4">
                    <h6 class="card-title"><strong>{{ file.title }}</strong></h6>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><small><span><b>level: </b>{{ file.level }}</span></small></li>
                    <li class="list-group-item"><small><span><b>Subject: </b>{{ file.subject }}</span></small></li>
                </ul>
            </div>
        </div>
    </div>

</template>