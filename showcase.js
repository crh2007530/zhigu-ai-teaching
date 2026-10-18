'use strict';
(() => {
 const names=['观察定位','初次判断','围绕原文追问','回应与修正','换题核对','教师过程复核'];
 const examples=[
  {label:'只按屏幕方位',before:'我选尺骨，因为它在屏幕右边。',quote:'在屏幕右边',question:'先把自己放到被观察者的位置：标准解剖学姿势下，这块骨靠近拇指侧还是小指侧？',after:'只看屏幕左右不够。标准解剖学姿势下，桡骨在前臂外侧、拇指侧，应以人体自身方位判断。',comparison:'修正解释补充了标准解剖学姿势和拇指侧依据，教师还需核对其在换观察方向时能否运用。'},
  {label:'选对但理由不足',before:'我选桡骨，因为看起来比较细。',quote:'看起来比较细',question:'如果图片比例改变，还能用哪个身体方位或手部相邻关系来核对？',after:'粗细受图片影响，我还要确认它位于前臂、靠近拇指侧，并用人体自身内外侧说明。',comparison:'修正解释增加了部位与方位线索。选择是否正确和依据是否充分需要分别评价。'},
  {label:'已有合理依据',before:'我选桡骨。标准解剖学姿势下，它在前臂外侧、拇指侧，与位于小指侧的尺骨区分。',quote:'前臂外侧、拇指侧',question:'你已经给出方位依据。如果观察者换到人体后方，应怎样保留这个判断基准？',after:'我保留原判断。观察方向变化时仍以人体自身为基准，不能直接按屏幕左右交换骨名。',comparison:'初答已有合理依据，修正补充了观察方向变化时的判断方法。保留正确解释同样是学习过程。'}
 ];
 let step=0,scenario=0;
 const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const box=(title,text,active=false)=>`<div class="example-box ${active?'active':''}"><h3>${title}</h3><p>${esc(text)}</p></div>`;
 function render(){const x=examples[scenario];document.getElementById('demo-steps').innerHTML=names.map((n,i)=>`<button data-step="${i}" ${i===step?'aria-current="step"':''}><span>0${i+1}</span>${n}</button>`).join('');
  const body=[
   `<h2>先确定观察基准</h2><p class="stage-lead">本课目标：用人体自身方位解释桡骨与尺骨的区分依据。</p><div class="observe-layout"><div class="observe-figure"><img src="skeleton.png" alt="人体骨骼前面观，用于观察部位"><span>前面观 · 预设观察图</span></div><ul><li>确认标准解剖学姿势。</li><li>找到前臂与手的连续关系。</li><li>说出靠近拇指侧还是小指侧。</li></ul></div>`,
   `<h2>先听见学生的理由</h2><p class="stage-lead">同一道题可能暴露不同问题。切换预设输入，比较下一步追问。</p><div class="scenario-pick">${examples.map((e,i)=>`<button data-scenario="${i}" aria-pressed="${i===scenario}">${e.label}</button>`).join('')}</div>${box('预设学生输入',x.before)}<p class="stage-lead">实际课堂先记录选择和原话，暂不把“选对”当作“依据完整”。</p>`,
   `<h2>追问紧扣学生原话</h2><p class="stage-lead">下面是课程设计预先编写的追问示例。实际伴学会将当前理由交给真实模型。</p><div class="example-box active"><span class="example-tag">预设追问示例 · 未调用模型</span><blockquote>学生原话：“${esc(x.quote)}”</blockquote><p>${esc(x.question)}</p></div><p class="stage-lead">程序会检查实际模型是否引用原文、字段是否齐全，并保留返回信息供教师核对。</p>`,
   `<h2>把前后解释放在一起</h2><p class="stage-lead">学生可以修正，也可以保留原来的合理判断。</p><div class="compare">${box('预设初答依据',x.before)}${box('预设修正解释',x.after,true)}</div>${box('预设比较建议 · 待教师核对',x.comparison)}`,
   `<h2>换个情境，再说明依据</h2><p class="stage-lead">实际系统根据本轮关注点，从预设日常题库匹配一道迁移题。</p>${box('迁移练习的核对方向','观察者换到人体后方时，判断桡尺骨的方位基准是否改变？请用人体自身方位解释。',true)}<div class="example-box"><h3>记录方式</h3><p>选择题按固定参考答案判分。开放依据由教师评分，单题结果单独保留，不并入独立前后测。</p></div>`,
   `<h2>教师核对整条学习过程</h2><p class="stage-lead">实际作品可导出过程对照卡，教师逐项复核并保留意见。</p><table class="rubric"><thead><tr><th>核对内容</th><th>关注问题</th></tr></thead><tbody><tr><td>原文引用</td><td>是否确实来自学生本次理由？</td></tr><tr><td>追问针对性</td><td>是否回应了这一位学生的依据？</td></tr><tr><td>内容与比较</td><td>解剖内容能否查证，比较是否忠于两次解释？</td></tr><tr><td>依据人工评分</td><td>分别评价初答与修正，不自动推断学习提升。</td></tr></tbody></table><a class="stage-link" href="index.html#lesson">进入实际课堂，写下自己的判断 ↗</a>`
  ][step];
  document.getElementById('demo-content').innerHTML=`<p class="step-number">TEACHING DESIGN / 0${step+1}</p>${body}`;document.getElementById('demo-count').textContent=`0${step+1} / 06`;document.getElementById('demo-prev').disabled=step===0;document.getElementById('demo-next').disabled=step===5;
 }
 document.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b||b.disabled)return;if(b.dataset.step!==undefined)step=Number(b.dataset.step);if(b.dataset.scenario!==undefined)scenario=Number(b.dataset.scenario);if(b.id==='demo-prev')step--;if(b.id==='demo-next')step++;render();});render();
})();
