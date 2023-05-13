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
        onDownloadFile(path) {
            // Create a reference to the file we want to download
            console.log(path)
            const storage = getStorage();
            const starsRef = ref(storage, path);
            getDownloadURL(starsRef)
                .then((url) => {
                    console.log(url)
                    const xhr = new XMLHttpRequest()
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                        const blob = xhr.response;
                    };
                    xhr.onloadend = (event) => {
                        console.log(path)
                        console.log(event)
                        console.log(xhr)
                        const url = window.URL.createObjectURL(xhr.response);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', path.slice(42));
                        document.body.appendChild(link);
                        link.click();
                    }

                    xhr.open('GET', url);
                    xhr.send();
                })
                .catch((error) => {
                    console.log(error)
                })
        },
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
                    <div class="row my-4 text-center">
                        <h5 class="card-title"><strong>{{ material[1].title }}</strong></h5>
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