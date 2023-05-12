<script>
import VuePdfEmbed from 'vue-pdf-embed'

export default {
    name: 'MyFile',
    props: ['material'],
    components: {
        VuePdfEmbed,
    },
    data() {
        return {
        }
    },
    methods:{
        refreshpage () {
        window.location.reload();
    },
    },
}
</script>

<template>
    <div class="col-md-6 col-lg-4 d-flex">
        <div class="card">
            <div class="card-header">
                <div v-if="material[2] != undefined">
                    <vue-pdf-embed :source=material[2] :disable-text-layer=true :page="1" />
                </div>
            </div>
            <div class="card-body">
                <div class="row text-center my-4">
                    <h5 class="card-title"><strong>{{ material[1].title }}</strong></h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><small><span><b>level: </b>{{ material[1].level }}</span></small></li>
                    <li class="list-group-item"><small><span><b>Subject: </b>{{ material[1].subject }}</span></small></li>
                </ul>
            </div>
        </div>
    </div>

</template>