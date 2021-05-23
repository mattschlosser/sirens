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
    <div class="container">
      <h4>Recent Requests</h4>
      <table class="table table-responsive">
        <thead>
            <tr><th>Timestamp</th><th>Reason</th><th>Notified</th></tr>
        </thead>
        
          <tr  v-for="(item, i) in recent" :key='i'>
            <td>{{Intl.DateTimeFormat(window.navigator.language || 'en-CA', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(item.timestamp + 'Z'))}}</td><td>---</td><td>{{item.nofified ? `Yes` : `No`}}</td>
          </tr>
      </table>
      </div>
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
      window,
      error: false,
      success: false, 
      res: null, 
      subscription: null, 
      recent: []
    }
  }, 
  created() {
    this.load();
  }, 
  methods: {

    async saveSubscription(subscription) {
      fetch(`${process.env.VUE_APP_BACKEND || `http://localhost:4000`}/save-subscription`, {
        method: 'POST', 
        body: JSON.stringify(subscription), 
        headers: {
          'Content-type': "application/json"
        }
      })
    }, 
    getRecentSirens() {
      return fetch(`${process.env.VUE_APP_BACKEND || `http://localhost:4000`}/recent`, {
        method: 'POST', 
        body: JSON.stringify(this.subscription), 
        headers: {
          'Content-type': "application/json"
        }
      }).then(r => r.json())
    }, 
    async load() {
      this.res =  await navigator.serviceWorker.register('service.js');
      this.subscription = await this.res.pushManager.getSubscription();
      console.log(this.subscription);
      this.recent = await this.getRecentSirens();
    }, 
    async notify() {
      const permission = await window.Notification.requestPermission();
      let {res, subscription} = this;
      if (permission !== 'granted') {
        this.error = true
      } else {
        this.success = true
        if (!subscription) {
          this.subscription = await res.pushManager.subscribe({userVisibleOnly: true})
        }
        // return subscription;
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
