<script>
import VuePdfEmbed from 'vue-pdf-embed'

export default {
    name: 'MyFile',
    props: ['file'],
    components: {
        VuePdfEmbed,
    },
    data() {
        return {
        }
    }
}
</script>

<template>

    <vue-pdf-embed :source=file height="200" :disable-text-layer=true :page="1" />

</template>