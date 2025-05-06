<template>
    <div>
        <div class="input-group md-form form-sm form-2 pl-0">
            <input class="form-control mr-sm-2" type="search" 
                :placeholder="placeholder" aria-label="Buscar" 
                v-model="textToSearch" @input="searchOnChange">
                <div class="input-group-append">
                    <span class="input-group-text red darken-4" id="basic-text1">
                        <font-awesome-icon icon="fa-search" inverse/>
                    </span>
                </div>
        </div>        
    </div>    
</template>

<script>

export default {
    name:"Buscador",
    components:{
    },
    props:{
        placeholder: String,
        dataToSearch: Array,
        fieldToSearch: String
    },
    data(){
        return{
            textToSearch: null,
        }
    },
    methods:{
        search(evt){
            evt.preventDefault();

            const field = this.fieldToSearch;

            const filter = new RegExp( this.textToSearch, "ig" );

            let resultadoDeBusqueda = this.dataToSearch.filter( d => d[field].search( filter ) != -1  )

            this.$emit( 'busqueda', resultadoDeBusqueda );
        },
        searchOnChange(){
            let $vm = this;
            const field = this.fieldToSearch;

            const filter = new RegExp( this.textToSearch, "ig" );

            let resultadoDeBusqueda = this.dataToSearch.filter( d => d[field].search( filter ) != -1  )

            this.$emit( 'busqueda', resultadoDeBusqueda );

        }
    }
}
</script>