let div_wrapper = document.querySelector('.wrapper')

async function fetchUsers() {
    let url = 'https://api.slingacademy.com/v1/sample-data/users';
    let result = await fetch(url);
    let data = await result.json();
    render(data.users);
}

async function fetchPosts(id) {
    let url = 'https://api.slingacademy.com/v1/sample-data/blog-posts';
    let result = await fetch(url);
    let data = await result.json();
    let blogs = data.blogs
    let blog = blogs.find(elem => elem.id == id)
    let content = blog.content_html
    getTitle(content, blog.id)
}

function getTitle(content, id) {
    let regex = /<h2>(.*?)<\/h2>/g
    let titles = []
    let matches = content.match(regex);
    let extractedTitles = matches.map(elem => elem.replace(/<\/?h2>/g, ''));
    titles = titles.concat(extractedTitles);
    modal(titles, id)
}

function render(data) {
    let div_container = document.createElement('div');
    div_container.className = 'users_container';

    for (elem of data) {
        let user_card = createUserCard(elem);
        div_container.append(user_card);
    }

    div_wrapper.append(div_container);
}

function createUserCard(elem) {
    let user_card = document.createElement('div');
    let user_name = document.createElement('p');
    let user_lastname = document.createElement('p');
    let user_email = document.createElement('p');
    let user_job = document.createElement('p');

    user_card.className = 'user_card';
    user_name.innerText = `Name: ${elem.first_name}`;
    user_lastname.innerText = `Last name: ${elem.last_name}`;
    user_email.innerText = `Email: ${elem.email}`;
    user_job.innerText = `Job: ${elem.job}`;

    user_card.onclick = () => {
        fetchPosts(elem.id);
    };

    user_card.append(user_name, user_lastname, user_email, user_job);
    return user_card;
}

function modal(posts, id) {
    let modal_area = document.createElement('div')
    let modal_container = document.createElement('div')
    modal_area.className = 'modal_area'
    modal_container.className = 'modal_container'

    let cancel_btn = document.createElement('button')
    let icon = document.createElement('span')
    cancel_btn.title = 'close'
    icon.className = 'fa-sharp fa-solid fa-xmark fa-2xl'

    let posts_wrapper = document.createElement('div')
    let posts_title = document.createElement('div')
    let title = document.createElement('p')
    posts_wrapper.className = 'posts_wrapper'
    title.innerText = `Список постов пользователя ${id}:`
    posts_title.innerHTML = ''

    if (posts.length === 0) {
        let noPostsMessage = document.createElement('p')
        noPostsMessage.innerText = 'This user has no posts.'
        posts_title.appendChild(noPostsMessage)
    } else {
        let postList = document.createElement('ul')
        let counter = 0
        for (let i = 0; i < posts.length; i++) {
            let list_item = document.createElement('li')
            list_item.innerText = `${++counter}) ${posts[i]}`
            postList.append(list_item)
        }
        posts_title.append(postList);
    }

    cancel_btn.append(icon)
    posts_wrapper.append(title, posts_title)
    modal_container.append(posts_wrapper, cancel_btn)
    modal_area.append(modal_container)
    div_wrapper.append(modal_area)

    modal_area.onclick = () => {
        modal_area.remove()
    }

    modal_container.onclick = (event) => {
        event.stopPropagation()
    }

    cancel_btn.onclick = () => {
        modal_area.remove()
    }
}



fetchUsers()

