<script>
import VuePdfEmbed from 'vue-pdf-embed'
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection,onSnapshot, doc, getFirestore, setDoc, updateDoc, deleteDoc, Timestamp, getDoc, getDocs, query, where } from 'firebase/firestore'

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
    <div class="col-md-6 col-lg-4 d-flex">
        <div class="card">
            <div class="card-header">
                <div class="row ">
                    <div class="col-9"></div>
                    <div class="col-3">
                        <RouterLink :to="{ path: '/edit_file', name: 'edit_file', params: { file_doc_ref: material[0] } }"  >
                            <button class="btn btn-default">Edit</button>
                        </RouterLink>
                    </div>
                </div>
                <div v-if="material[2] != undefined">
                    <vue-pdf-embed :source=material[2] :disable-text-layer="true" :page="1" />
                </div>
            </div>
            <div class="card-body">
                <div class="row my-4">
                    <h6 class="card-title"><strong>{{ material[1].title }}</strong></h6>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><small><span><b>level: </b>{{ material[1].level }}</span></small></li>
                    <li class="list-group-item"><small><span><b>Subject: </b>{{ material[1].subject }}</span></small></li>
                </ul>
                <!-- <button class="btn btn-default"  @click="onDownloadFile(material[1].file_url)">DownLoad</button>
                <button class="btn btn-default"  @click="onDeleteFile(material[0])">Delete</button>
                <RouterLink :to="{ path: '/edit_file', name: 'edit_file', params: { file_doc_ref: material[0] } }"  >
                    <button class="btn btn-default">Edit</button>
                </RouterLink> -->
            </div>
        </div>
    </div>

</template>