let tutorials = [];
let filteredTutorials = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    setupMarked();
    loadTutorials();
});

// Configurar marked.js
function setupMarked() {
    marked.setOptions({
        highlight: function (code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
}

// Carregar lista de tutoriais
async function loadTutorials() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    loading.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        // Tentar carregar o arquivo index.txt
        const response = await fetch('md/index.txt');
        if (!response.ok) {
            throw new Error('Arquivo index.txt não encontrado');
        }

        const indexContent = await response.text();
        const filenames = indexContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && line.endsWith('.md'));

        if (filenames.length === 0) {
            throw new Error('Nenhum arquivo .md listado no index.txt');
        }

        // Carregar metadados de cada arquivo
        tutorials = [];
        for (const filename of filenames) {
            try {
                const tutorial = await loadTutorialMetadata(filename);
                if (tutorial) {
                    tutorials.push(tutorial);
                }
            } catch (error) {
                console.log(`Erro ao carregar ${filename}:`, error.message);
            }
        }

        if (tutorials.length === 0) {
            throw new Error('Nenhum tutorial válido encontrado');
        }

        // Ordenar por data (mais recente primeiro)
        tutorials.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredTutorials = tutorials;
        displayTutorials(filteredTutorials);

    } catch (error) {
        console.error('Erro ao carregar tutoriais:', error);
        errorMessage.style.display = 'block';
    }

    loading.style.display = 'none';
}

// Carregar metadados de um tutorial específico
async function loadTutorialMetadata(filename) {
    try {
        const response = await fetch(`md/${filename}`);
        if (!response.ok) {
            throw new Error(`Arquivo ${filename} não encontrado`);
        }

        const content = await response.text();
        const stats = await getFileStats(`md/${filename}`);

        return {
            id: filename.replace('.md', ''),
            file: filename,
            ...parseMarkdownMetadata(content, filename),
            content: content,
            size: formatFileSize(content.length),
            lastModified: stats.lastModified || new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error(`Erro ao carregar ${filename}:`, error);
        return null;
    }
}

// Tentar obter estatísticas do arquivo
async function getFileStats(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const lastModified = response.headers.get('last-modified');
        return {
            lastModified: lastModified ? new Date(lastModified).toISOString().split('T')[0] : null
        };
    } catch (error) {
        return {};
    }
}

// Extrair metadados do markdown
function parseMarkdownMetadata(content, filename) {
    const lines = content.split('\n');
    let title = filename.replace('.md', '').replace(/-/g, ' ');
    let description = 'Tutorial de Linux';
    let tags = [];
    let date = new Date().toISOString().split('T')[0];

    // Extrair título do primeiro cabeçalho
    for (let line of lines) {
        if (line.startsWith('# ')) {
            title = line.replace('# ', '').trim();
            break;
        }
    }

    // Extrair descrição do primeiro parágrafo
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line &&
            !line.startsWith('#') &&
            !line.startsWith('```') &&
            !line.startsWith('---') &&
            !line.startsWith('![') &&
            line.length > 30) {
            description = line.substring(0, 150) + (line.length > 150 ? '...' : '');
            break;
        }
    }

    // Gerar tags inteligentes
    const filenameParts = filename.replace('.md', '').split(/[-_]/);
    const contentLower = content.toLowerCase();

    // Tags do nome do arquivo
    tags.push(...filenameParts.filter(part => part.length > 2).slice(0, 3));

    // Tags baseadas no conteúdo
    const keywordMap = {
        'ubuntu': ['ubuntu', 'linux'],
        'debian': ['debian', 'linux'],
        'centos': ['centos', 'rhel'],
        'docker': ['docker', 'container'],
        'kubernetes': ['kubernetes', 'k8s'],
        'nginx': ['nginx', 'web-server'],
        'apache': ['apache', 'web-server'],
        'mysql': ['mysql', 'database'],
        'postgresql': ['postgresql', 'database'],
        'bash': ['bash', 'scripting'],
        'python': ['python', 'programming'],
        'ssh': ['ssh', 'security'],
        'ssl': ['ssl', 'security'],
        'firewall': ['firewall', 'security'],
        'git': ['git', 'version-control'],
        'backup': ['backup', 'recovery'],
        'cron': ['cron', 'automation'],
        'vim': ['vim', 'editor'],
        'systemd': ['systemd', 'services']
    };

    for (const [keyword, relatedTags] of Object.entries(keywordMap)) {
        if (contentLower.includes(keyword)) {
            tags.push(...relatedTags);
        }
    }

    // Remover duplicatas e limitar
    tags = [...new Set(tags)].filter(tag => tag.length > 1).slice(0, 6);

    return {
        title,
        description,
        tags,
        date
    };
}

// Formatar tamanho do arquivo
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
}

// Buscar tutoriais
function searchTutorials() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (query === '') {
        filteredTutorials = tutorials;
    } else {
        filteredTutorials = tutorials.filter(tutorial =>
            tutorial.title.toLowerCase().includes(query) ||
            tutorial.description.toLowerCase().includes(query) ||
            tutorial.tags.some(tag => tag.toLowerCase().includes(query)) ||
            tutorial.file.toLowerCase().includes(query) ||
            (tutorial.content && tutorial.content.toLowerCase().includes(query))
        );
    }

    displayTutorials(filteredTutorials);
}

// Manipular busca com Enter
function handleSearch(event) {
    if (event.key === 'Enter') {
        searchTutorials();
    }
}

// Exibir lista de tutoriais
function displayTutorials(tutorialList) {
    const container = document.getElementById('tutorialsList');
    const noResults = document.getElementById('noResults');

    if (tutorialList.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    const html = tutorialList.map(tutorial => `
                <div class="col-md-6 col-xl-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-start mb-3">
                                <i class="fas fa-file-code text-primary me-3" style="font-size: 1.8rem;"></i>
                                <div class="flex-grow-1">
                                    <h5 class="card-title mb-2">${tutorial.title}</h5>
                                    <p class="card-text text-muted small">${tutorial.description}</p>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <small class="text-muted">
                                    <i class="fas fa-file me-1"></i>${tutorial.file}
                                    ${tutorial.size ? `<span class="ms-2">${tutorial.size}</span>` : ''}
                                </small>
                            </div>
                            
                            <div class="mb-3">
                                ${tutorial.tags.slice(0, 4).map(tag =>
        `<span class="badge bg-secondary me-1 mb-1">${tag}</span>`
    ).join('')}
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-0 pt-0">
                            <button class="btn btn-primary w-100" onclick="loadTutorial('${tutorial.file}', '${tutorial.title}')">
                                <i class="fas fa-book-open me-2"></i>Ler Tutorial
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

    container.innerHTML = html;
}

// Carregar e exibir tutorial
async function loadTutorial(filename, title) {
    const homeView = document.getElementById('homeView');
    const tutorialView = document.getElementById('tutorialView');
    const backBtn = document.getElementById('backBtn');
    const contentDiv = document.getElementById('tutorialContent');

    try {
        let content;

        // Tentar carregar do cache primeiro
        const cachedTutorial = tutorials.find(t => t.file === filename);
        if (cachedTutorial && cachedTutorial.content) {
            content = cachedTutorial.content;
        } else {
            // Carregar do servidor
            const response = await fetch(`md/${filename}`);
            if (!response.ok) {
                throw new Error('Arquivo não encontrado');
            }
            content = await response.text();
        }

        // Converter markdown para HTML
        const htmlContent = marked.parse(content);
        contentDiv.innerHTML = htmlContent;

        // Aplicar highlight no código e adicionar botões de copiar
        contentDiv.querySelectorAll('pre code').forEach((block, index) => {
            hljs.highlightElement(block);

            // Adicionar botão de copiar
            const pre = block.parentElement;
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i>Copiar';
            copyBtn.onclick = () => copyCodeToClipboard(copyBtn, block);
            pre.appendChild(copyBtn);
        });

        // Também adicionar botões para blocos de código sem linguagem específica
        contentDiv.querySelectorAll('pre:not(:has(code))').forEach((pre) => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i>Copiar';
            copyBtn.onclick = () => copyCodeToClipboard(copyBtn, pre);
            pre.appendChild(copyBtn);
        });

        // Mostrar tutorial
        homeView.style.display = 'none';
        tutorialView.style.display = 'block';
        backBtn.style.display = 'block';

        // Scroll para o topo
        window.scrollTo(0, 0);

    } catch (error) {
        console.error('Erro ao carregar tutorial:', error);
        alert('Erro ao carregar o tutorial. Verifique se o arquivo existe na pasta md/');
    }
}

// Voltar para home
function showHome() {
    const homeView = document.getElementById('homeView');
    const tutorialView = document.getElementById('tutorialView');
    const backBtn = document.getElementById('backBtn');

    homeView.style.display = 'block';
    tutorialView.style.display = 'none';
    backBtn.style.display = 'none';

    // Limpar busca
    document.getElementById('searchInput').value = '';
    filteredTutorials = tutorials;
    displayTutorials(filteredTutorials);

    window.scrollTo(0, 0);
}

// Copiar código para clipboard
async function copyCodeToClipboard(button, codeElement) {
    try {
        // Obter o texto do código
        const code = codeElement.tagName === 'PRE' ?
            codeElement.textContent :
            codeElement.textContent;

        // Remover o texto do botão copiar se estiver incluído
        const cleanCode = code.replace(/Copiar$|Copiado!$/, '').trim();

        // Copiar para clipboard
        await navigator.clipboard.writeText(cleanCode);

        // Feedback visual
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check me-1"></i>Copiado!';
        button.classList.add('copied');

        // Voltar ao estado original após 2 segundos
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);

    } catch (err) {
        console.error('Erro ao copiar:', err);

        // Fallback para browsers mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = codeElement.textContent.replace(/Copiar$|Copiado!$/, '').trim();
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            button.innerHTML = '<i class="fas fa-check me-1"></i>Copiado!';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy me-1"></i>Copiar';
                button.classList.remove('copied');
            }, 2000);
        } catch (fallbackErr) {
            console.error('Erro no fallback:', fallbackErr);
            alert('Não foi possível copiar automaticamente. Use Ctrl+C');
        }

        document.body.removeChild(textArea);
    }
}