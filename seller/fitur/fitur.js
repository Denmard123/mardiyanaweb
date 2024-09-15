document.getElementById('newFeatureForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const title = document.getElementById('featureTitle').value;
    const description = document.getElementById('featureDescription').value;
    const price = document.getElementById('featurePrice').value;
  
    const newFeature = {
      title: title,
      description: description,
      price: price
    };
  
    // Simulasi penyimpanan data, bisa diganti dengan fetch API untuk menyimpan ke server
    console.log('Feature Added:', newFeature);
  
    // Menampilkan pesan konfirmasi
    document.getElementById('confirmationMessage').innerText = `New feature "${title}" has been added successfully!`;
  
    // Clear form fields
    document.getElementById('newFeatureForm').reset();
  });
  