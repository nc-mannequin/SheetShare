<script>
import VuePdfEmbed from 'vue-pdf-embed'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

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
                    <button class="btn btn-warning" @click="onDownloadFile(file.file_url)">Download</button>
                  </div>
                </div>
            </div>
        </div>
    </div>
</RouterLink>

</template>