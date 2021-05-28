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
            <td>{{Intl.DateTimeFormat(window.navigator.language || 'en-CA', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(item.timestamp + 'Z'))}}</td><td>{{item.reason || `---`}}</td><td>{{item.notified ? `Yes` : `No`}}</td>
          </tr>
      </table>
      </div>
  </div>
</template>

<script>
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray  
}
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
          const applicationServerKey = urlB64ToUint8Array(process.env.VUE_APP_VAPID_PUBLIC)
          this.subscription = await res.pushManager.subscribe({userVisibleOnly: true, applicationServerKey})
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
