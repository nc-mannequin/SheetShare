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
        <div class="col">
        <div class="card mb-3 h-100 border border-warning">
            <div class="row">
                <div class="col-md-6">
                    <div v-if="file.source != undefined">
                        <vue-pdf-embed :source=file.source :disable-text-layer="true" :page="1" />
                    </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body">
                    <div class="row my-4 text-center">
                        <h5 class="card-title"><strong>{{ file.title }}</strong></h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><small><span><b>level: </b>{{ file.level }}</span></small></li>
                        <li class="list-group-item"><small><span><b>Subject: </b>{{ file.subject }}</span></small></li>
                    </ul>
                  </div>
                </div>
            </div>
        </div>
    </div>

</template>