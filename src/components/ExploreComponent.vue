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
<RouterLink :to="{ path: '/material', name: 'material', params: { file_doc_ref: file[0] } }"  >
        <div class="col">
        <div class="card mb-3 h-100 border border-warning">
            <div class="row">
                <div class="col-md-6">
                    <div v-if="file[1].source != undefined">
                        <vue-pdf-embed :source=file[1].source :disable-text-layer="true" :page="1" />
                    </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body">
                    <div class="row my-4 text-center">
                        <h5 class="card-title"><strong>{{ file[1].title }}</strong></h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><small><span><b>level: </b>{{ file[1].level }}</span></small></li>
                        <li class="list-group-item"><small><span><b>Subject: </b>{{ file[1].subject }}</span></small></li>
                    </ul>
                  </div>
                </div>
            </div>
        </div>
    </div>
</RouterLink>

</template>