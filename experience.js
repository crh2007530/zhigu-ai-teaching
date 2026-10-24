'use strict';
(() => {
 const main=document.querySelector('main'),heading=document.querySelector('.heading');
 const entry=document.createElement('div');entry.className='workspace-bar';
 entry.innerHTML='<p id="workspace-label">学生学习端</p><div role="group" aria-label="选择使用身份"><button data-workspace="student" aria-pressed="true">我是学生</button><button data-workspace="teacher" aria-pressed="false">我是教师</button></div>';
 main.prepend(entry);
 const guide=document.createElement('section');guide.className='usage-guide';guide.setAttribute('aria-label','使用顺序与记录分享');
 guide.innerHTML='<div class="usage-current"><div><b id="usage-title"></b><p id="usage-copy"></p></div><button id="usage-next" class="primary"></button></div><div id="resume-home"></div><details id="usage-details"><summary>第一次使用？查看完整学习顺序与记录分享</summary><ol class="usage-steps"><li><button data-tab="assessment"><b>01</b> 课前前测</button><span>新建一轮，完成前测，记录学习起点。</span></li><li><button data-tab="learn"><b>02</b> 课程学习</button><span>点选骨骼、看教材，记录辨认依据。</span></li><li><button data-tab="lesson"><b>03</b> AI 伴学课堂</button><span>初答 → 追问 → 修正 → 迁移，完成一节课。</span></li><li><button data-tab="practice"><b>04</b> 专项与错题</button><span>专项练习后，到“错题复习”巩固薄弱点。</span></li><li><button data-tab="assessment"><b>05</b> 后测与复测</button><span>回到同轮完成后测；建议间隔至少7天再复测。</span></li><li><button data-tab="teacher"><b>06</b> 教师复核</button><span>学生导出、教师导入，核对依据并安排重讲。</span></li></ol><p class="usage-note">课程与练习可直接使用。AI 伴学课堂用于完整任务；“AI 学伴”用于围绕当前骨骼自由提问，需要连接个人 AI。可按需使用，学习顺序是建议。</p><div class="student-share"><b>把学习记录交给老师</b><p>练习/测评与 AI 伴学使用两种档案。换设备前也请分别导出；记录不会自动上传。</p><div class="actions"><label class="inline"><input type="checkbox" id="student-include-rationale">练习快照包含辨认依据</label><button data-action="export-student">导出练习与测评快照</button><button id="share-lesson">去导出 AI 伴学档案 →</button></div><p class="muted">快照默认不含自由文本和笔记。含依据的文件分享前请检查身份信息。AI 档案在课堂中点击“导出本次档案（含依据）”，由教师在对应入口导入。</p></div><p class="usage-links"><a href="https://crh2007530.github.io/zhigu-ai-teaching/materials/">作品材料与本地版</a> · <a href="https://github.com/crh2007530/zhigu-ai-teaching" target="_blank" rel="noreferrer">项目源码</a></p></details>';
 heading.after(guide);
 const resume=document.getElementById('resume-slot');guide.querySelector('#resume-home').append(resume);
 const workflow=document.querySelector('.workflow');if(workflow)guide.after(workflow);
 const setup=document.getElementById('online-ai-setup');if(setup&&workflow)workflow.after(setup);
 const info={
  lesson:['完成一节 AI 伴学课','先选择判断并写出依据，再获得 AI 追问；回应后修正解释，最后完成迁移题。','完成后做专项练习','practice'],
  learn:['先观察，再说明辨认依据','点选骨骼或模块，查看位置与相邻关系；保存自己的判断，再进入 AI 伴学讨论。','下一步：AI 伴学课堂','lesson'],
  practice:['练习后查看解析与错题','选择模块、题型和题量后开始；有未完成的一轮会直接恢复。每题选答案，再点击“记录本题答案”。','下一步：错题复习','review'],
  review:['把错题变成下一次学习任务','查看最近错题，回教材核对，或练习相关题；重答正确后会移出错题列表。','巩固后进入后测','assessment'],
  assessment:['同一轮：前测 → 学习 → 后测 → 复测','先新建一轮并做前测，再去学习；学完回到本轮做后测。未到7天的复测会明确标注为即时复测。','去课程学习','learn'],
  ai:['按需提问，回教材核对','连接个人 AI，选择骨骼与助教方式，填写问题后发送。需要完整的追问、修正和迁移记录，请进入伴学课堂。','进入完整伴学任务','lesson'],
  teacher:['教师使用顺序：导入 → 查看 → 复核 → 导出','练习/测评快照在上方导入，AI 伴学 JSON 在下方“AI伴学过程档案”导入；两类记录分别统计与复核。','前往导入记录 ↓',null]
 };
 let lastStudent='lesson';
 const go=name=>document.querySelector(`nav [data-tab="${name}"]`)?.click();
 function update(name){
  const teacher=name==='teacher';if(!teacher)lastStudent=name;
  main.dataset.workspaceMode=teacher?'teacher':'student';
  document.getElementById('workspace-label').textContent=teacher?'教师复核端 · 本机工具':'学生学习端 · 本机保存';
  entry.querySelectorAll('[data-workspace]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.workspace===(teacher?'teacher':'student')));
  const [title,copy,next,target]=info[name];
  document.getElementById('usage-title').textContent=title;document.getElementById('usage-copy').textContent=copy;
  const button=document.getElementById('usage-next');button.textContent=next;
  button.onclick=()=>{if(target){go(target);document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'start'});}else document.getElementById('teacher').scrollIntoView({behavior:'smooth',block:'start'});};
  guide.querySelector('#usage-details').hidden=teacher;
  guide.querySelectorAll('.usage-steps [data-tab]').forEach(b=>b.setAttribute('aria-current',b.dataset.tab===name?'step':'false'));
 }
 entry.addEventListener('click',ev=>{const b=ev.target.closest('[data-workspace]');if(b)go(b.dataset.workspace==='teacher'?'teacher':lastStudent);});
 document.getElementById('share-lesson').onclick=()=>{go('lesson');document.querySelector('[data-lesson-action="export"]')?.scrollIntoView({behavior:'smooth',block:'center'});};
 document.addEventListener('zhigu:tab',ev=>update(ev.detail));
 update(main.dataset.view||'lesson');
})();
