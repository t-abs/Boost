const BLYNK_TOKEN = 'Tic_nyd0OmtLl2oqXewLNa_xhpny19GV'; // Replace with your actual Blynk project token

function fetchBlynkData(pin, callback) {
    const url = `https://blynk.cloud/external/api/get?token=Tic_nyd0OmtLl2oqXewLNa_xhpny19GV&pin=${pin}`;
  fetch(url)
    .then(response => response.text()) // Note: Blynk API returns plain text, not JSON
    .then(data => callback(data))
    .catch(error => console.error('Error fetching data from Blynk:', error));
}

function getBpm() {
  fetchBlynkData('V0', data => {
    document.getElementById('bpm-value').textContent = `${data} BPM`;
    checkAlerts('BPM', parseFloat(data));
  });
}

function getEcg() {
  fetchBlynkData('V1', data => { // Assuming V1 is the virtual pin for ECG
    document.getElementById('ecg-value').textContent = `${data} mV`;
    checkAlerts('ECG', parseFloat(data));
  });
}

function getTemperature() {
  fetchBlynkData('V2', data => { // Assuming V2 is the virtual pin for temperature
    document.getElementById('temperature-value').textContent = `${data} °C`;
    checkAlerts('Temperature', parseFloat(data));
  });
}

function getSpO2() {
  fetchBlynkData('V3', data => { // Assuming V3 is the virtual pin for SpO2
    document.getElementById('spo2-value').textContent = `${data} %`;
    checkAlerts('SpO2', parseFloat(data));
  });
}

function addMedication(medication) {
  const medicationsList = document.getElementById('medications-list');
  const listItem = document.createElement('li');
  listItem.textContent = medication;
  medicationsList.appendChild(listItem);
}

function checkAlerts(parameter, value) {
  const alertMessage = document.getElementById('alert-message');
  let alert = '';

  if (parameter === 'BPM' && value > 100) {
    alert = 'BPM is too high. You may need medication!';
    addMedication('Metoprolol (Lopressor, Toprol-XL)');
    addMedication('Atenolol (Tenormin)');
  } else if (parameter === 'ECG' && value > 1) { // Customize the ECG threshold based on your data
    alert = 'ECG shows abnormal activity. You may need medication!';
    addMedication('Flecainide (Tambocor)');
    addMedication('Propafenone (Rythmol)');
  } else if (parameter === 'Temperature' && value > 37.5) { // Assuming 37.5 °C as the threshold for high temperature
    alert = 'Temperature is too high. You may need medication!';
    addMedication('Acetaminophen');
    addMedication('Ibuprofen (Advil, Motrin IB)');
    addMedication('Aspirin');
  } else if (parameter === 'SpO2' && value < 92) { // Assuming 92% as the threshold for low SpO2
    alert = 'SpO2 is too low. You may need medication!';
    addMedication('Acetazolamide');
  }

  if (alert) {
    alertMessage.textContent = alert;
    alertMessage.style.color = '#cc0000';
    alertMessage.style.fontWeight = 'bold';
  } else {
    alertMessage.textContent = 'No alerts';
    alertMessage.style.color = '';
    alertMessage.style.fontWeight = '';
  }
}

function addReminder() {
  const newReminder = document.getElementById('new-reminder').value;
  if (newReminder) {
    addMedication(newReminder);
    document.getElementById('new-reminder').value = '';
  }
}
