<template>
  <div class="hello">
    <div class="alert alert-danger" v-if="error">
      Permission denied. We won't be able to send you notifications regarding
    </div>
    <div class="alert alert-success" v-if="success">
      Permission granted. We'll notify you when we know what the sirens were about.
    </div>
    <button class="btn btn-primary btn-block" @click="notify">
      I hear sirens
    </button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  }, 
  data() {
    return {
      error: false,
      success: false
    }
  }, 
  methods: {
    async saveSubscription(subscription) {
      fetch('https://sirens.mattschlosser.me/save-subscription', {
        method: 'POST', 
        body: JSON.stringify(subscription), 
        headers: {
          'Content-type': "application/json"
        }
      })
    }, 
    async notify() {
      const permission = await window.Notification.requestPermission();

      if (permission !== 'granted') {
        this.error = true
      } else {
        this.success = true
        let subscription = await navigator.serviceWorker.register('service.js').then(res => res.pushManager.getSubscription());
        this.saveSubscription(subscription);
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
