const VAPID_PUBLIC =  'BI10h0BBUuysQHi1I4lHGEufncl-Gt8449hsV-gO_H2tVZPGw3CE5WejoyjlIfKF89SUCGc_BG5PwHqdaPJyZZo'
const SERVER_URL = 'https://sirens.mattschlosser.me/save-subscription'

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray  
}
const saveSubscription = async subscription => {
    const response = await fetch(SERVER_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json()
}
const showLocalNotification = (title, body, swRegistration) => {
    const options = {
      body,
      // here you can add more properties like icon, image, vibrate, etc.
    }
    swRegistration.showNotification(title, options)
}
self.addEventListener('push', function(event) {
    if (event.data) {
      console.log('Push event!! ', event.data.json())
      data = event.data.json()
      // let text = data.event_description;
      let text = `${data.event_description} - ${data.dispatch_date} ${data.dispatch_time} - ${data.equipment_assigned } - ${data.approximate_location}, ${data.neighbourhood_name}`
      showLocalNotification('Sirens', text, self.registration)
    } else {
      console.log('Push event but no data')
    }
})
self.addEventListener('activate', async () => {
    // This will be called only once when the service worker is activated.
    console.log("ACTIVE")
    try {
        const types = new Uint32Array(16)
        crypto.getRandomValues(types)
    
        const applicationServerKey = urlB64ToUint8Array(VAPID_PUBLIC)
        const options = { applicationServerKey, userVisibleOnly: true }
        const subscription = await self.registration.pushManager.subscribe(options)
        // console.log(JSON.stringify(subscription))
        // saveSubscription(subscription); 
    } catch (err) {
        console.log('Error', err)
    }
})