const avatarInput = document.getElementById('avatarInput')
const avatarPreview = document.getElementById('avatarPreview')

avatarInput.addEventListener('change', function() {
    const file = this.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function(e) {
            avatarPreview.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

// Sau khi submit form update profile thành công
showToast('Cập nhật thông tin thành công', 'success');
