// Placeholder JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.textContent = 'Toggle Dark Mode';
    darkModeToggle.classList.add('btn', 'btn-secondary','ml-2');
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.querySelector('.navbar .container').appendChild(darkModeToggle);

     function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }
});

function loadCourses(){
  fetch('/api/courses')
          .then(response => response.json())
          .then(courses => {
            const courseGrid = document.getElementById('course-grid');
                courseGrid.innerHTML = '';
                courses.forEach(course => {
                    const courseCard = document.createElement('div');
                    courseCard.classList.add('course-card');
                    courseCard.innerHTML = `
                       <img src="./img/${course.thumbnail}" alt="${course.title}">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                        <a href="/courses/${course.id}" class="btn btn-primary">Learn More</a>
                    `;
                    courseGrid.appendChild(courseCard);
                  });
          })
        .catch(error => console.error('Error fetching courses:', error));
}
function loadCourseDetails(){
   const courseId = window.location.pathname.split('/').pop();
        fetch(`/api/courses/${courseId}`)
            .then(response => response.json())
            .then(course => {
                document.querySelector('.course-title').textContent = course.title;
                 document.querySelector('.course-overview').textContent = course.overview;
                const documentationTab = document.querySelector('#documentation');
                documentationTab.innerHTML = course.documentation;
               const videoTab = document.querySelector('#videos');
               if (course.videos && Array.isArray(course.videos)) {
                 videoTab.innerHTML = course.videos.map(video => `<video src="${video}" controls></video>`).join('');
               }

             const sidebar = document.querySelector('.sidebar ul');
                sidebar.innerHTML = '';
                if (course.modules && Array.isArray(course.modules)){
                     course.modules.forEach(module => {
                       const moduleItem = document.createElement('li');
                        moduleItem.textContent = module.name;
                        moduleItem.addEventListener('click', () => displayModuleContent(module.content, module.videos));
                       sidebar.appendChild(moduleItem);
                     })
                }
          })
    .catch(error => console.error('Error fetching course details:', error));
}
function displayModuleContent(content,videos){
  document.querySelector('#documentation').innerHTML = content;
   const videoTab = document.querySelector('#videos');
    if (videos && Array.isArray(videos)){
      videoTab.innerHTML = videos.map(video => `<video src="${video}" controls></video>`).join('');
     } else {
       videoTab.innerHTML = '';
      }
}
function initTabs(){
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
     tab.addEventListener('click', ()=>{
         tabs.forEach(t => t.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
           const tabContentId = tab.getAttribute('data-tab');
            document.getElementById(tabContentId).classList.add('active');
       });
    });

     tabs[0].click();
}
if(window.location.pathname === '/courses.html') {
  loadCourses();
}
 if (window.location.pathname.startsWith('/courses/')) {
    loadCourseDetails();
     initTabs();
}