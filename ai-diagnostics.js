'use strict';
(() => {
 const $=id=>document.getElementById(id),offline=location.protocol==='file:';
 let testing=false,report=[];
 const show=(id,text)=>{$(id).textContent=text;};
 async function health(){
  if(offline){show('api-runtime','离线文件模式');show('api-key-state','尚不可检测');show('api-detail','先双击“本地作品/启用AI.cmd”，输入密钥，再使用 http://127.0.0.1:8790/ 。浏览器文件页面无法访问AI网关。');return null;}
  try{const res=await window.ZhiguAPI.fetch('/api/status',{signal:AbortSignal.timeout(5000)});if(!res.ok)throw Error('本机服务状态读取失败');const d=await res.json();
   show('api-runtime',window.ZHIGU_RUNTIME.staticHosted?'浏览器直连官方接口':'本机网关正常');show('api-provider',d.provider==='deepseek'?'DeepSeek':'千问');show('api-model',d.model);show('api-key-state',d.configured?'已配置，需真实调用检测':'未配置');
   for(const kind of ['text','image']){const last=d.lastSuccess?.[kind];show('api-'+kind+'-state',last?`本次服务已收到回答 · ${new Date(last.at).toLocaleTimeString()}`:kind==='image'&&d.imageSupported===false?'当前模型未配置图片支持':'尚未检测成功');}
   show('api-detail',window.ZHIGU_RUNTIME.staticHosted?(d.configured?'本次密钥已临时设置，尚需真实调用检测。问题、教学图片和密钥会直达所选官方模型；调用消耗你自己的额度。':'请在页面顶部填写自己的API密钥，启用后再做真实调用检测。密钥仅在当前页面内存中使用。'):d.configured?'服务与密钥已配置。点击下方真实调用检测，才能判断当前账号和模型是否可用。检测会使用少量模型额度。':'网关已启动，尚未配置密钥。关闭当前服务，运行启用AI.cmd，在命令窗口隐藏输入对应服务密钥。');return d;
  }catch(err){show('api-runtime','本机服务未连接');show('api-key-state','尚不可检测');show('api-detail','检查失败：'+err.message+'。请启动本机服务后刷新。');return null;}
 }
 function lock(value){testing=value;for(const id of ['api-check','api-test-text','api-test-image'])$(id).disabled=value;}
 async function run(kind){
  if(testing)return;const state=await health();if(!state)return;
  if(!state.configured){show('api-detail','未配置密钥，未发送模型请求。请在页面顶部填写并启用自己的密钥；本地版使用启用AI.cmd。');return;}
  let image=null;if(kind==='image'){const preview=$('image-preview');if(preview.hidden||!preview.src.startsWith('data:image/')){show('api-detail','请先在下方AI学伴中选择教学图片，再点击“检测图片API”。');return;}image=preview.src;}
  lock(true);show('api-'+kind+'-state','正在真实调用……');show('api-detail','正在等待真实模型回答，最长约45秒。没有使用示例回答替代。');
  const input={testKind:kind,...(image?{image}:{})},entry={at:new Date().toISOString(),testKind:kind,provider:state.provider,model:state.model,imageIncluded:!!image};
  try{const res=await window.ZhiguAPI.fetch('/api/test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(55000)}),d=await res.json();entry.httpStatus=res.status;
   if(!res.ok)throw Error(d.error||'模型接口返回错误');
   Object.assign(entry,{success:true,requestId:d.requestId,elapsedMs:d.elapsedMs,answer:d.answer,scope:d.scope});
   show('api-'+kind+'-state',`调用成功 · ${(d.elapsedMs/1000).toFixed(2)}秒`);
   show('api-detail',`收到模型回答（${d.provider} / ${d.model}）\n本机请求编号：${d.requestId}\n\n${d.answer}\n\n${d.scope}`);
   show('gateway-state',`${d.provider==='deepseek'?'DeepSeek':'千问'} · ${kind==='image'?'图片':'文字'}调用已返回`);
  }catch(err){Object.assign(entry,{success:false,error:err.name==='TimeoutError'?'等待超时':err.message});show('api-'+kind+'-state','调用失败');show('api-detail','未通过真实调用检测：'+entry.error);}
  finally{report.push(entry);lock(false);}
 }
 $('api-check').onclick=health;$('api-test-text').onclick=()=>run('text');$('api-test-image').onclick=()=>run('image');
 $('api-export').onclick=()=>{if(!report.length){show('api-detail','本页尚无真实调用检测记录可导出。检查服务本身不产生模型检测结果。');return;}
  const data={format:'zhigu-api-connectivity',version:1,exportedAt:new Date().toISOString(),scope:'接口连通性检测；不代表识图准确率或课堂成效。图片原始数据与密钥不在报告中。',records:report};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='知骨_API真实调用检测记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 if(['#ai','#api'].includes(location.hash)){document.querySelector('nav [data-tab="ai"]').click();if(location.hash==='#api')$('api-panel').open=true;}
 window.addEventListener('zhigu-ai-config',health);
 health();
})();
