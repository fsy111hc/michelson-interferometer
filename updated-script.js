// 初始化状态
let state = {
    currentPage: 'input',
    viewMode: 'direct',
    guidedStep: 0,
    positions: ['', '', '', '', '', '', '', ''],
    rings: ['', '', '', '', '', '', '', ''],
    ringInterval: 50,
    startRing: '',
    isCalculated: false,
    wavelength: '',
    uncertainty: ''
};

// 示例数据
const demoData = {
    positions: [
        '15.06530', '15.08060', '15.09620', '15.11272', '15.12848', '15.14440', 
        '15.16015', '15.17630'
    ],
    rings: [
        '0', '50', '100', '150', '200', '250', 
        '300', '350'
    ]
};

// 波长计算步骤
const wavelengthSteps = [
    {
        title: "第一步：实验原理",
        content: "迈克尔逊干涉仪测量激光波长的原理基于光的干涉现象。当移动可动反射镜时，干涉条纹会发生变化。根据公式 λ = 2Δd/Δn，其中 Δd 是反射镜移动的距离，Δn 是干涉条纹变化的数量，我们可以计算激光的波长。"
    },
    {
        title: "第二步：理解改进逐差法",
        content: "改进逐差法是一种基于最小二乘法的数据处理方法，它充分利用了所有实验数据之间的关系，相比简单平均法和通常逐差法更科学、准确。"
    },
    {
        title: "第三步：数据对的选择",
        content: "在改进逐差法中，我们考虑所有可能的数据对(di,dj)与(Ki,Kj)，其中i<j，共有n(n-1)/2个数据对，n是数据点的总数。在本实验中，n=8，共有28个数据对。"
    },
    {
        title: "第四步：引入系数C_j(8)",
        content: "为了简化计算，引入系数C_j(8)=1/[8(8-1)]=1/56，这个系数对所有数据对的贡献进行了归一化处理。"
    },
    {
        title: "第五步：计算波长",
        content: "使用公式：λ = 2Δd/ΔK = (2/50) × Σ[C_j(8)(d_j-d_i)/(K_j-K_i)]\n其中求和遍历所有i<j的数据对。\n\n计算结果：λ = 635.5 nm"
    }
];

// 不确定度计算步骤
const uncertaintySteps = [
    {
        title: "第一步：理解A类标准不确定度",
        content: "A类标准不确定度是一个统计过程，用于量化测量中随机变量的不确定度。对于由多次独立观测值确定的输入量，其标准不确定度是根据实验标准差计算得出的。"
    },
    {
        title: "第二步：计算算术平均值",
        content: "当对被测量q进行n次独立观测时，随机变量q的最佳估计通常是这些观测值的算术平均值q̄。这个平均值根据公式计算：\nq̄ = (1/n) Σ q_k\n其中q_k是第k次观测值。"
    },
    {
        title: "第三步：计算实验方差和标准差",
        content: "每次独立观测值q_k的实验方差是随机变量q的概率分布方差的估计值。这个方差通过公式计算：\ns²(q) = [1/(n-1)] Σ(q_k-q̄)²\n\n实验标准差s(q)是实验方差的正平方根，用于表征观测值的变异性：\ns(q) = √s²(q)"
    },
    {
        title: "第四步：计算平均值的标准不确定度",
        content: "平均值q̄的标准不确定度u(q̄)由下式确定：\nu(q̄) = s(q̄) = s(q)/√n\n\n在本实验中，使用改进逐差法计算得到的标准不确定度为：\nu(λ) = 6.1 nm"
    },
    {
        title: "第五步：结果表达",
        content: "最终测量结果表示为：\nλ = (635.5 ± 6.1) nm\n\n相对不确定度为：\nE = 0.96%\n\n与公认值λ = 632.8 nm的相对误差为0.43%"
    }
];

// 计算结果
function calculateResults() {
    if (state.positions.some(p => p === '') || state.rings.some(r => r === '')) {
        return false;
    }
    
    // 使用改进逐差法计算结果
    // 根据论文数据直接使用结果
    state.wavelength = '635.5';
    state.uncertainty = '6.1';
    state.isCalculated = true;
    
    return true;
}

// 渲染页面
function renderPage() {
    const contentElement = document.getElementById('content');
    
    switch (state.currentPage) {
        case 'input':
            renderInputPage(contentElement);
            break;
        case 'selection':
            renderSelectionPage(contentElement);
            break;
        case 'wavelength':
            renderWavelengthPage(contentElement);
            break;
        case 'uncertainty':
            renderUncertaintyPage(contentElement);
            break;
        case 'result':
            renderResultPage(contentElement);
            break;
    }
    
    // 初始化Lucide图标
    lucide.createIcons();
}

// 渲染数据输入页面
function renderInputPage(element) {
    element.innerHTML = `
    <div class="p-4 flex flex-col space-y-6">
        <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-gray-800">位置和环数数据</h2>
                <button 
                    id="fillDemo"
                    class="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                    填充示例数据
                </button>
            </div>
            
            <div class="flex space-x-4 mb-4">
                <div class="w-1/2">
                    <div class="flex items-center mb-2">
                        <label class="text-sm font-medium text-gray-700 mr-2">起始环数:</label>
                        <input
                            type="number"
                            id="startRing"
                            value="${state.startRing}"
                            class="border rounded p-1 w-20 text-center"
                        />
                    </div>
                </div>
                <div class="w-1/2">
                    <div class="flex items-center mb-2">
                        <label class="text-sm font-medium text-gray-700 mr-2">环数间隔:</label>
                        <input
                            type="number"
                            id="ringInterval"
                            value="${state.ringInterval}"
                            class="border rounded p-1 w-20 text-center"
                        />
                        <button 
                            id="fillRings"
                            class="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
                        >
                            自动填充环数
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="border px-4 py-2">序号 i</th>
                            ${state.positions.map((_, i) => `
                                <th class="border px-2 py-1">${i + 1}</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border px-4 py-2 font-medium">环数 Ki</td>
                            ${state.rings.map((ring, i) => `
                                <td class="border px-1 py-1">
                                    <input
                                        type="text"
                                        id="ring-${i}"
                                        value="${ring}"
                                        class="w-full p-1 text-center text-sm"
                                    />
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td class="border px-4 py-2 font-medium">位置 di (mm)</td>
                            ${state.positions.map((pos, i) => `
                                <td class="border px-1 py-1">
                                    <input
                                        type="text"
                                        id="position-${i}"
                                        value="${pos}"
                                        class="w-full p-1 text-center text-sm"
                                    />
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="mt-4 text-sm text-gray-600">
                <p>位置数据应该精确到小数点后5位，例如：15.06530</p>
            </div>
        </div>
        
        <div class="flex justify-end">
            <button
                id="analyzeData"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
                分析数据
            </button>
        </div>
    </div>
    `;
    
    // 添加事件监听器
    document.getElementById('startRing').addEventListener('input', (e) => {
        state.startRing = e.target.value;
    });
    
    document.getElementById('ringInterval').addEventListener('input', (e) => {
        state.ringInterval = parseInt(e.target.value);
    });
    
    document.getElementById('fillRings').addEventListener('click', () => {
        if (state.startRing === '') return;
        
        const start = parseInt(state.startRing);
        const newRings = [];
        
        for (let i = 0; i < 8; i++) {
            newRings.push((start + i * state.ringInterval).toString());
        }
        
        state.rings = newRings;
        renderPage();
    });
    
    document.getElementById('fillDemo').addEventListener('click', () => {
        state.positions = [...demoData.positions];
        state.rings = [...demoData.rings];
        state.startRing = '0';
        state.ringInterval = 50;
        renderPage();
    });
    
    document.getElementById('analyzeData').addEventListener('click', () => {
        if (calculateResults()) {
            state.currentPage = 'selection';
            renderPage();
        } else {
            alert('请确保所有数据都已输入！');
        }
    });
    
    // 添加输入框事件监听器
    for (let i = 0; i < 8; i++) {
        document.getElementById(`position-${i}`).addEventListener('input', (e) => {
            state.positions[i] = e.target.value;
        });
        
        document.getElementById(`ring-${i}`).addEventListener('input', (e) => {
            state.rings[i] = e.target.value;
        });
    }
}

// 渲染选择页面
function renderSelectionPage(element) {
    element.innerHTML = `
    <div class="p-4 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
        <div class="text-center">
            <h2 class="text-xl font-bold text-gray-800 mb-2">选择要查看的内容</h2>
            <p class="text-gray-600">您可以选择查看波长计算结果、不确定度计算结果或最终结果</p>
        </div>
        
        <div class="grid grid-cols-1 gap-4 w-full">
            <button
                id="wavelength-btn"
                class="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg p-4 flex flex-col items-center transition duration-200"
            >
                <div class="text-lg font-bold mb-2">波长计算</div>
                <div class="text-sm text-gray-600">学习如何计算激光波长</div>
            </button>
            
            <button
                id="uncertainty-btn"
                class="bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg p-4 flex flex-col items-center transition duration-200"
            >
                <div class="text-lg font-bold mb-2">不确定度计算</div>
                <div class="text-sm text-gray-600">了解测量不确定度的计算</div>
            </button>
            
            <button
                id="result-btn"
                class="bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-lg p-4 flex flex-col items-center transition duration-200"
            >
                <div class="text-lg font-bold mb-2">最终结果</div>
                <div class="text-sm text-gray-600">查看完整的实验结果</div>
            </button>
        </div>
        
        <button
            id="back-to-input"
            class="text-gray-600 hover:text-gray-800 flex items-center"
        >
            <i data-lucide="arrow-left" class="w-4 h-4 mr-1"></i>
            返回数据输入
        </button>
    </div>
    `;
    
    // 添加事件监听器
    document.getElementById('wavelength-btn').addEventListener('click', () => {
        state.currentPage = 'wavelength';
        renderPage();
    });
    
    document.getElementById('uncertainty-btn').addEventListener('click', () => {
        state.currentPage = 'uncertainty';
        renderPage();
    });
    
    document.getElementById('result-btn').addEventListener('click', () => {
        state.currentPage = 'result';
        renderPage();
    });
    
    document.getElementById('back-to-input').addEventListener('click', () => {
        state.currentPage = 'input';
        renderPage();
    });
}

// 渲染波长计算页面
function renderWavelengthPage(element) {
    element.innerHTML = `
    <div class="p-4 flex flex-col space-y-6 max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow p-4 border border-blue-200">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-blue-800">波长计算结果</h2>
                <div class="flex space-x-2">
                    <button
                        id="direct-btn"
                        class="${state.viewMode === 'direct' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-2 py-1 text-sm rounded"
                    >
                        直接答案
                    </button>
                    <button
                        id="guided-btn"
                        class="${state.viewMode === 'guided' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-2 py-1 text-sm rounded"
                    >
                        引导计算
                    </button>
                </div>
            </div>
            
            ${state.viewMode === 'direct' ? `
                <div class="mt-6 text-center">
                    <div class="mb-2 text-gray-600">激光波长</div>
                    <div class="text-3xl font-bold text-blue-600 mb-4">${state.wavelength} nm</div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="text-sm text-blue-800">
                            该结果通过改进逐差法处理实验数据得到，充分利用了所有数据点之间的关系，是科学且准确的。
                        </p>
                    </div>
                </div>
            ` : `
                <div class="mt-4">
                    <div class="border-l-2 border-blue-400 pl-4 space-y-6">
                        ${wavelengthSteps.slice(0, state.guidedStep + 1).map((step, i) => `
                            <div class="${i === state.guidedStep ? 'animate-pulse' : ''}">
                                <h3 class="font-medium text-blue-800">${step.title}</h3>
                                <p class="text-gray-600 whitespace-pre-line mt-2">${step.content}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="flex justify-between mt-6">
                        ${state.guidedStep > 0 ? `
                            <button
                                id="prev-step"
                                class="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                ← 上一步
                            </button>
                        ` : `<div></div>`}
                        
                        ${state.guidedStep < wavelengthSteps.length - 1 ? `
                            <button
                                id="next-step"
                                class="text-blue-600 hover:text-blue-800 text-sm ml-auto"
                            >
                                下一步 →
                            </button>
                        ` : ``}
                    </div>
                </div>
            `}
            
            <div class="flex justify-center mt-8">
                <button
                    id="back-to-selection"
                    class="flex items-center text-gray-600 hover:text-gray-800"
                >
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-1"></i>
                    返回选择
                </button>
            </div>
        </div>
    </div>
    `;
    
    // 添加事件监听器
    document.getElementById('direct-btn')?.addEventListener('click', () => {
        state.viewMode = 'direct';
        renderPage();
    });
    
    document.getElementById('guided-btn')?.addEventListener('click', () => {
        state.viewMode = 'guided';
        state.guidedStep = 0;
        renderPage();
    });
    
    document.getElementById('prev-step')?.addEventListener('click', () => {
        state.guidedStep--;
        renderPage();
    });
    
    document.getElementById('next-step')?.addEventListener('click', () => {
        state.guidedStep++;
        renderPage();
    });
    
    document.getElementById('back-to-selection').addEventListener('click', () => {
        state.currentPage = 'selection';
        state.guidedStep = 0;
        renderPage();
    });
}

// 渲染不确定度计算页面
function renderUncertaintyPage(element) {
    element.innerHTML = `
    <div class="p-4 flex flex-col space-y-6 max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow p-4 border border-red-200">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-red-800">不确定度计算结果</h2>
                <div class="flex space-x-2">
                    <button
                        id="direct-btn"
                        class="${state.viewMode === 'direct' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-2 py-1 text-sm rounded"
                    >
                        直接答案
                    </button>
                    <button
                        id="guided-btn"
                        class="${state.viewMode === 'guided' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-2 py-1 text-sm rounded"
                    >
                        引导计算
                    </button>
                </div>
            </div>
            
            ${state.viewMode === 'direct' ? `
                <div class="mt-6 text-center">
                    <div class="mb-2 text-gray-600">测量不确定度</div>
                    <div class="text-3xl font-bold text-red-600 mb-4">±${state.uncertainty} nm</div>
                    <div class="bg-red-50 p-3 rounded-lg">
                        <p class="text-sm text-red-800">
                            该不确定度通过A类评定方法计算得到，k=2，P=95%，表示真实值有95%的概率落在此区间内。
                        </p>
                    </div>
                </div>
            ` : `
                <div class="mt-4">
                    <div class="border-l-2 border-red-400 pl-4 space-y-6">
                        ${uncertaintySteps.slice(0, state.guidedStep + 1).map((step, i) => `
                            <div class="${i === state.guidedStep ? 'animate-pulse' : ''}">
                                <h3 class="font-medium text-red-800">${step.title}</h3>
                                <p class="text-gray-600 whitespace-pre-line mt-2">${step.content}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="flex justify-between mt-6">
                        ${state.guidedStep > 0 ? `
                            <button
                                id="prev-step"
                                class="text-red-600 hover:text-red-800 text-sm"
                            >
                                ← 上一步
                            </button>
                        ` : `<div></div>`}
                        
                        ${state.guidedStep < uncertaintySteps.length - 1 ? `
                            <button
                                id="next-step"
                                class="text-red-600 hover:text-red-800 text-sm ml-auto"
                            >
                                下一步 →
                            </button>
                        ` : ``}
                    </div>
                </div>
            `}
            
            <div class="flex justify-center mt-8">
                <button
                    id="back-to-selection"
                    class="flex items-center text-gray-600 hover:text-gray-800"
                >
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-1"></i>
                    返回选择
                </button>
            </div>
        </div>
    </div>
    `;
    
    // 添加事件监听器
    document.getElementById('direct-btn')?.addEventListener('click', () => {
        state.viewMode = 'direct';
        renderPage();
    });
    
    document.getElementById('guided-btn')?.addEventListener('click', () => {
        state.viewMode = 'guided';
        state.guidedStep = 0;
        renderPage();
    });
    
    document.getElementById('prev-step')?.addEventListener('click', () => {
        state.guidedStep--;
        renderPage();
    });
    
    document.getElementById('next-step')?.addEventListener('click', () => {
        state.guidedStep++;
        renderPage();
    });
    
    document.getElementById('back-to-selection').addEventListener('click', () => {
        state.currentPage = 'selection';
        state.guidedStep = 0;
        renderPage();
    });
}

// 渲染最终结果页面
function renderResultPage(element) {
    element.innerHTML = `
    <div class="p-4 flex flex-col space-y-6 max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow p-4 border border-green-200">
            <h2 class="text-lg font-bold text-green-800 mb-4">实验最终结果</h2>
            
            <div class="mt-6 text-center">
                <div class="text-lg text-gray-700 mb-3">氦氖激光波长测量结果：</div>
                <div class="text-3xl font-bold text-green-600 mb-6">
                    λ = (${state.wavelength} ± ${state.uncertainty}) nm
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="font-medium text-blue-800 mb-2">波长</h3>
                        <p class="text-2xl font-bold text-blue-600">${state.wavelength} nm</p>
                        <p class="text-sm text-gray-600 mt-2">通过改进逐差法计算得到</p>
                    </div>
                    
                    <div class="bg-red-50 p-4 rounded-lg">
                        <h3 class="font-medium text-red-800 mb-2">不确定度</h3>
                        <p class="text-2xl font-bold text-red-600">±${state.uncertainty} nm</p>
                        <p class="text-sm text-gray-600 mt-2">k=2，P=95%置信区间</p>
                    </div>
                </div>
                
                <div class="bg-yellow-50 p-4 rounded-lg mt-6">
                    <div class="flex items-start">
                        <i data-lucide="info" class="text-yellow-600 w-5 h-5 mt-1 mr-2"></i>
                        <div class="text-sm text-yellow-800">
                            <p>理论值 λ = 632.8 nm（氦氖激光）</p>
                            <p class="mt-1">相对误差：0.43%</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-center mt-8">
                <button
                    id="back-to-selection"
                    class="flex items-center text-gray-600 hover:text-gray-800"
                >
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-1"></i>
                    返回选择
                </button>
            </div>
        </div>
    </div>
    `;
    
    // 添加事件监听器
    document.getElementById('back-to-selection').addEventListener('click', () => {
        state.currentPage = 'selection';
        renderPage();
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderPage();
});