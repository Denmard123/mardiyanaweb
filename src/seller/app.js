document.addEventListener('DOMContentLoaded', function() {
    const toastContainer = document.getElementById('toastContainer');
    const contentContainer = document.getElementById('contentContainer');
    const addContentBtn = document.getElementById('addContentBtn');

    // Function to show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `bg-${type === 'success' ? 'green' : 'red'}-500 text-white p-3 rounded-lg shadow-lg mb-2`;
        toast.innerHTML = `<p>${message}</p>`;
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Function to edit content
    window.editContent = function(button) {
        const contentItem = button.closest('.content-item');
        const description = contentItem.querySelector('[id^="description"]');
        
        const newDescription = prompt('Enter new description:', description.innerHTML);
        if (newDescription !== null) {
            description.innerHTML = newDescription;
            showToast('Description updated successfully!');
        }
        
        const newImageSrc = prompt('Enter new image URL (leave empty to skip):');
        if (newImageSrc) {
            const firstImage = contentItem.querySelector('[data-carousel-item] img');
            if (firstImage) {
                firstImage.src = newImageSrc;
                showToast('Image updated successfully!');
            } else {
                showToast('No image found to update.', 'error');
            }
        }
    }

    // Function to delete content
window.deleteContent = function(button) {
    const contentItem = button.closest('.content-item');
    contentItem.remove();  // Remove the entire content item
    showToast('Content removed successfully.');
}


    // Function to add new content
    addContentBtn.addEventListener('click', function() {
        const newContent = document.createElement('div');
        newContent.className = 'content-item bg-white rounded-lg shadow-md p-4 mb-4 relative z-10';
        newContent.innerHTML = `
            <div class="w-[333px] h-[350px] bg-slate-100 rounded-[20px]">
                <div class="flex-col justify-start items-start flex">
                    <div id="default-carousel" class="relative w-full bg-base-200" data-carousel="slide">
                        <div class="relative h-40 overflow-hidden rounded-lg">
                            <!-- Show this image by default -->
                            <div class="duration-700 ease-in-out z-50" data-carousel-item>
                                <img src="https://via.placeholder.com/300" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="Placeholder Image">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-black py-1 text-sm font-normal leading-tight tracking-tight" id="description1">
                    New content description.
                </div>
                <button class="btn btn-outline btn-success" onclick="editContent(this)">Edit</button>
                <button class="btn btn-outline btn-danger" onclick="deleteContent(this)">Hapus</button>
            </div>
        `;

        contentContainer.appendChild(newContent);
        showToast('New content added successfully!');
    });
});
