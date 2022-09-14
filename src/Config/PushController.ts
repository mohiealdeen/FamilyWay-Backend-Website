import admin from 'firebase-admin';
import fetch from 'node-fetch';

const PushController = async (userFCMToken: string, data: any) => {
  var serviceAccount = require('../familyway.json');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  if (Array.isArray(userFCMToken)) {
    var notification = {
      title: 'Best Deals',
      text: 'Mobile Devices at 50% off. Only for today'
    };
    var notification_body = {
      notification: notification,
      registration_ids: userFCMToken
    };
    console.log(notification_body)
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        // replace authorization key with your key
        Authorization: 'key=' + 'AAAAGPVv9-k:APA91bFJX8Tyu6cMNi69QoKL2PcAhbnREwUN2gyKNzBRTk_0u_-_um7UCvgu0ZcpcHI5HJRq6XXYi3lELADuvzjDApPtFL753KJTqLOmTBIDxlg_G9YmjOH3MO3wk6QWXb8UH0RV97qd',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification_body)
    })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.error(error);
      });
  } else {
    let message: any = {
      data,
      token: userFCMToken
    };

    await admin
      .messaging()
      .send(message)
      .then(response => {
        // Response is a message ID string.
        console.log(response);
      })
      .catch(error => {
        console.log('Error sending message:', error);
      });
  }

  // if (Array.isArray(userFCMToken)) {
  //   let message: any = {
  //     notification,
  //     tokens: userFCMToken
  //   };
  //   await admin
  //     .messaging()
  //     .sendMulticast(message)
  //     .then(response => {
  //       // Response is a message ID string.
  //       console.log(response);
  //     })
  //     .catch(error => {
  //       console.log('Error sending message:', error);
  //     });
  // } else {
  //   let message: any = {
  //     notification,
  //     token: userFCMToken
  //   };
  //   console.log(message);
  //   await admin
  //     .messaging()
  //     .send(message)
  //     .then(response => {
  //       // Response is a message ID string.
  //       console.log(response);
  //     })
  //     .catch(error => {
  //       console.log('Error sending message:', error);
  //     });
  // }
};

export default PushController;
