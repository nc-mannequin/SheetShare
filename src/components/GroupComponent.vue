<script>

export default {
    name: 'Group',
    props: ['file'],
    components: {
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
                <div class="col-md-12">
                  <div class="card-body">
                    <RouterLink :to="{ path: '/material', name: 'material', params: { file_doc_ref: file[0] } }"  >
                    <div class="row my-4 text-start ms-1">
                        <h6 class="card-title"><strong>{{ file[1].title }}</strong></h6>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><small><span><b>level: </b>{{ file[1].level }}</span></small></li>
                        <li class="list-group-item"><small><span><b>Subject: </b>{{ file[1].subject }}</span></small></li>
                    </ul>
                </RouterLink>
                    <div class="text-center mt-3">
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop-delete" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                                <span>Delete From Group</span>
                        </button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>

<div class="modal fade" id="staticBackdrop-delete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 underline" id="staticBackdropLabel"><strong>Delete From Group Confirmation</strong></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this material from group?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger">DELETE</button>
              </div>
            </div>
          </div>
    </div>
</template>