<script>
import VuePdfEmbed from 'vue-pdf-embed'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
    },
}
</script>

<template>
    <RouterLink :to="{ path: '/material', name: 'material', params: { file_doc_ref: material[0] } }"  >
    <div class="col">
        <div class="card mb-3 h-100 border border-warning">
            <div class="row">
                <div class="col-md-6">
                    <div v-if="material[2] != undefined">
                        <vue-pdf-embed :source=material[2] :disable-text-layer="true" :page="1" />
                    </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body">
                    <div class="row my-4 text-start ms-1">
                        <h6 class="card-title"><strong>{{ material[1].title }}</strong></h6>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><small><span><b>level: </b>{{ material[1].level }}</span></small></li>
                        <li class="list-group-item"><small><span><b>Subject: </b>{{ material[1].subject }}</span></small></li>
                    </ul>
                    <div class="row text-center mt-3 pt-3">
                        <RouterLink :to="{ path: '/edit_file', name: 'edit_file', params: { file_doc_ref: material[0] } }"  >
                            <button class="btn btn-warning"><span class="material-symbols-outlined me-3 thispage">edit</span>Edit</button>
                        </RouterLink>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
    </RouterLink>
</template>