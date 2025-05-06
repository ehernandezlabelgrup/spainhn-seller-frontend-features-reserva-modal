<template>
  <div id="app">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->

    <router-view/>
  </div>
</template>

<style>
/* @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'); */


@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(77,77,77);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
