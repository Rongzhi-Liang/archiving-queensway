import {esc,pick} from './research-utils.js?v=20261020-revision3';

let serial=0;
const manifestUrl=new URL('./assets/evidence-documents/stack-manifest.json?v=20261108-release1',import.meta.url);
const text=(value,lang)=>String(pick(value,lang)||'');

export function sourceDisplayFrame(item){
  const crop=item.displayCrop;
  return crop&&[crop.x,crop.y,crop.width,crop.height].every(Number.isFinite)&&crop.width>0&&crop.height>0
    ?crop:{x:0,y:0,width:item.width,height:item.height};
}
export function sourceImageMarkup(item,alt=''){
  const url=new URL(item.image,import.meta.url).href,frame=sourceDisplayFrame(item);
  const image=`<img src="${esc(url)}"${Number.isFinite(item.width)&&Number.isFinite(item.height)?` width="${item.width}" height="${item.height}"`:""} alt="${esc(alt)}" draggable="false"${item.displayCrop?` style="left:${-frame.x/frame.width*100}%;top:${-frame.y/frame.height*100}%;width:${item.width/frame.width*100}%;height:${item.height/frame.height*100}%"`:''}>`;
  return item.displayCrop?`<div class="c-source-crop" data-source-ratio="${frame.width/frame.height}">${image}</div>`:image;
}


/** Full source pages with separate, accessible highlight overlays. */
export function mountContextDocuments(container,{lang='en',resourceMode=false,onChange=()=>{},onSelect=()=>false,onReady=()=>{}}={}){
  const instance=++serial,t=(en,zh)=>lang==='zh'?zh:en;
  let alive=true,documents=[],documentId='',activeHighlight='',showHighlights=true,resizeObserver,expanded=null,expandedObserver,restoreState=null,zoom=1;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let progress=0,scrollTurn=0,manualOffset=0,visualTurn=0,targetTurn=0,manualFrame=0,manualTime=0,selectionKey='',radiusX=0,radiusY=0;
  const current=()=>documents.find(doc=>doc.id===documentId);
  const title=doc=>text(doc.title,lang);
  const sourceLabel=doc=>text(doc.sourceLabel,lang)||title(doc);
  const note=doc=>text(doc.note,lang);
  const highlights=doc=>(doc.highlights||[]).filter(item=>Array.isArray(item.rect)&&item.rect.length===4&&item.rect.every(Number.isFinite));
  const selected=()=>highlights(current()||{}).find(item=>item.id===activeHighlight);
  const passageControl=doc=>highlights(doc).length>1?`<button class="c-doc-next" data-c-doc-next>${t('Next passage','下一处')} <span class="c-doc-passage-count"></span><span aria-hidden="true">→</span></button>`:'';
  container.innerHTML=`<div class="c-doc-loading" role="status">${t('Opening the original document…','正在展开原始文件…')}</div>`;

  function sheetMarkup(doc,large=false){
    const frame=sourceDisplayFrame(doc);
    return `<div class="c-doc-sheet" data-highlight-visibility="${showHighlights}">
      ${sourceImageMarkup(doc,`${title(doc)} — ${doc.fullViewport||doc.sourceType==='official_website_viewport'?t('original website screenshot','原始网页截图'):t('complete original page','完整原始页面')}`)}
      <div class="c-doc-highlights">${highlights(doc).map(item=>{
        const [x,y,w,h]=item.rect;
        return `<button class="c-doc-highlight${item.id===activeHighlight?' is-selected':''}" data-c-doc-highlight="${esc(item.id)}" aria-label="${esc(text(item.label,lang))}" aria-pressed="${item.id===activeHighlight}" aria-describedby="c-doc-explanation-${instance}${large?'-large':''}" style="left:${(x-frame.x)/frame.width*100}%;top:${(y-frame.y)/frame.height*100}%;width:${w/frame.width*100}%;height:${h/frame.height*100}%"></button>`;
      }).join('')}</div>
    </div>`;
  }
  function updateExplanation(){
    const item=selected(),explanation=item?text(item.explanation,lang):t('Select a highlighted passage.','选择一处高亮内容。');
    for(const root of [container,expanded].filter(Boolean)){
      const output=root.querySelector('.c-doc-explanation');if(output)output.textContent=explanation;
      root.querySelectorAll('[data-c-doc-highlight]').forEach(button=>{
        const isSelected=button.dataset.cDocHighlight===activeHighlight;
        button.classList.toggle('is-selected',isSelected);button.setAttribute('aria-pressed',String(isSelected));
      });
      const passages=highlights(current()||{}),index=passages.findIndex(passage=>passage.id===activeHighlight)+1;
      root.querySelectorAll('[data-c-doc-next]').forEach(button=>{
        button.querySelector('.c-doc-passage-count').textContent=`${index}/${passages.length}`;
        button.setAttribute('aria-label',t(`Next highlighted passage. Currently ${index} of ${passages.length}.`,`下一处高亮。目前为第${index}处，共${passages.length}处。`));
      });
    }
  }
  function nextPassage(){
    const passages=highlights(current()||{});if(!passages.length)return;
    const index=passages.findIndex(passage=>passage.id===activeHighlight);
    activeHighlight=passages[(index+1)%passages.length].id;updateExplanation();
    if(!expanded)return;
    const viewport=expanded.querySelector('.c-doc-viewport');
    const highlight=[...expanded.querySelectorAll('[data-c-doc-highlight]')].find(button=>button.dataset.cDocHighlight===activeHighlight);
    if(!highlight)return;
    const box=highlight.getBoundingClientRect(),viewBox=viewport.getBoundingClientRect();
    viewport.scrollTo({left:viewport.scrollLeft+box.left-viewBox.left-(viewport.clientWidth-box.width)/2,top:viewport.scrollTop+box.top-viewBox.top-(viewport.clientHeight-box.height)/2,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  function fitStage(){
    if(!alive)return;
    const doc=current(),frame=container.querySelector('.c-doc-frame');if(!doc||!frame)return;
    const box=frame.getBoundingClientRect();
    radiusX=Math.min(130,box.width*.22);radiusY=Math.min(36,box.height*.1);
    frame.querySelectorAll('.c-doc-layer').forEach(layer=>{
      const item=documents.find(item=>item.id===layer.dataset.cDocSelect)||doc,display=sourceDisplayFrame(item);
      const scale=Math.max(.01,Math.min((box.width-76)/display.width,(box.height-24)/display.height));
      layer.style.width=`${display.width*scale}px`;layer.style.height=`${display.height*scale}px`;
      const sheet=layer.querySelector('.c-doc-sheet');if(sheet){sheet.style.width='100%';sheet.style.height='100%';}
    });
    paintDeck(visualTurn);
  }
  function toggleHighlights(){
    showHighlights=!showHighlights;
    for(const root of [container,expanded].filter(Boolean)){
      root.querySelectorAll('.c-doc-sheet').forEach(sheet=>sheet.dataset.highlightVisibility=String(showHighlights));
      root.querySelectorAll('[data-c-doc-toggle]').forEach(button=>{
        button.setAttribute('aria-pressed',String(showHighlights));
        button.textContent=t(showHighlights?'Highlights on':'Highlights off',showHighlights?'高亮已开':'高亮已关');
      });
      root.querySelectorAll('[data-c-doc-highlight]').forEach(button=>button.tabIndex=showHighlights?0:-1);
    }
  }
  function saveScrollPosition(){
    const elements=[];let parent=container.parentElement;
    while(parent){if(parent.scrollHeight>parent.clientHeight||parent.scrollWidth>parent.clientWidth)elements.push({element:parent,top:parent.scrollTop,left:parent.scrollLeft});parent=parent.parentElement;}
    return {focus:document.activeElement,elements,windowX:window.scrollX,windowY:window.scrollY};
  }
  function restoreScrollPosition(){
    const saved=restoreState;restoreState=null;if(!saved)return;
    if(saved.focus?.isConnected)saved.focus.focus({preventScroll:true});
    for(const item of saved.elements)if(item.element.isConnected){item.element.scrollTop=item.top;item.element.scrollLeft=item.left;}
    if(window.scrollX!==saved.windowX||window.scrollY!==saved.windowY)window.scrollTo({left:saved.windowX,top:saved.windowY,behavior:'instant'});
  }
  function closeExpanded(){
    if(!expanded)return;
    const dialog=expanded;expanded=null;
    expandedObserver?.disconnect();expandedObserver=null;
    dialog.removeEventListener('click',onClick);dialog.removeEventListener('focusin',onFocus);dialog.removeEventListener('cancel',onCancel);
    dialog.close();dialog.remove();restoreScrollPosition();
  }
  function onCancel(event){event.preventDefault();event.stopPropagation();closeExpanded();}
  function fitExpanded(preserveCentre=false){
    if(!expanded)return;
    const doc=current(),display=sourceDisplayFrame(doc),viewport=expanded.querySelector('.c-doc-viewport'),sheet=viewport.querySelector('.c-doc-sheet');
    const availableWidth=Math.max(160,viewport.clientWidth-48),availableHeight=Math.max(160,viewport.clientHeight-48);
    const base=Math.min(availableWidth/display.width,availableHeight/display.height);
    const oldWidth=sheet.getBoundingClientRect().width||display.width*base;
    const cx=(viewport.scrollLeft+viewport.clientWidth/2)/oldWidth,cy=(viewport.scrollTop+viewport.clientHeight/2)/(oldWidth*display.height/display.width);
    sheet.style.width=`${display.width*base*zoom}px`;sheet.style.height=`${display.height*base*zoom}px`;
    expanded.querySelector('[data-c-doc-zoom-label]').textContent=`${Math.round(zoom*100)}%`;
    if(preserveCentre){viewport.scrollLeft=Math.max(0,cx*display.width*base*zoom-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,cy*display.height*base*zoom-viewport.clientHeight/2);}
    else{viewport.scrollLeft=0;viewport.scrollTop=0;}
  }
  function openExpanded(){
    if(expanded)return;
    cancelAnimationFrame(manualFrame);manualFrame=0;manualTime=0;targetTurn=visualTurn;manualOffset=visualTurn-scrollTurn;
    const doc=current();if(!doc)return;
    restoreState=saveScrollPosition();zoom=1;
    expanded=document.createElement('dialog');expanded.className='c-doc-dialog';expanded.setAttribute('aria-labelledby',`c-doc-dialog-title-${instance}`);
    expanded.innerHTML=`<header class="c-doc-dialog-header">
      <div><span>${t('ORIGINAL DOCUMENT','原始文件')}</span><h2 id="c-doc-dialog-title-${instance}">${esc(title(doc))}</h2></div>
      <button class="c-doc-close" data-c-doc-close aria-label="${resourceMode?t('Close document and return to resources','关闭文件并返回资源页'):t('Close document and return to the story','关闭文件并返回故事')}" autofocus>${resourceMode?t('Back to resources','返回资源页'):t('Back to story','返回故事')} <b>×</b></button>
    </header>
    <div class="c-doc-dialog-toolbar"><div class="c-doc-zoom"><button data-c-doc-zoom=".8" aria-label="${t('Zoom out','缩小')}">−</button><output data-c-doc-zoom-label>100%</output><button data-c-doc-zoom="1.25" aria-label="${t('Zoom in','放大')}">+</button><button data-c-doc-fit>${t('Fit page','适合页面')}</button></div><button data-c-doc-toggle aria-pressed="${showHighlights}">${t(showHighlights?'Highlights on':'Highlights off',showHighlights?'高亮已开':'高亮已关')}</button>${passageControl(doc)}<a href="${esc(doc.sourceUrl)}" target="_blank" rel="noopener">${t('Original source','原始来源')} ↗</a></div>
    <div class="c-doc-viewport" tabindex="0" aria-label="${t('Document viewer. Use scroll bars or arrow keys to move around an enlarged page.','文件浏览区。放大后，可使用滚动条或方向键查看页面。')}"><div class="c-doc-page-space">${sheetMarkup(doc,true)}</div></div>
    <footer class="c-doc-dialog-footer"><p class="c-doc-explanation" id="c-doc-explanation-${instance}-large" aria-live="polite"></p>${note(doc)?`<small>${esc(note(doc))}</small>`:''}</footer>`;
    document.body.append(expanded);
    expanded.addEventListener('click',onClick);expanded.addEventListener('focusin',onFocus);expanded.addEventListener('cancel',onCancel);
    expanded.showModal();fitExpanded();updateExplanation();
    expandedObserver=new ResizeObserver(()=>fitExpanded(true));expandedObserver.observe(expanded.querySelector('.c-doc-viewport'));
  }
  function onFocus(event){
    const button=event.target.closest('[data-c-doc-highlight]');if(button){activeHighlight=button.dataset.cDocHighlight;updateExplanation();}
  }
  function onClick(event){
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.cDocSelect){selectDocument(button.dataset.cDocSelect);return;}
    if(button.dataset.cDocHighlight){activeHighlight=button.dataset.cDocHighlight;updateExplanation();return;}
    if(button.hasAttribute('data-c-doc-enlarge'))openExpanded();
    else if(button.hasAttribute('data-c-doc-close'))closeExpanded();
    else if(button.hasAttribute('data-c-doc-toggle'))toggleHighlights();
    else if(button.hasAttribute('data-c-doc-next'))nextPassage();
    else if(button.dataset.cDocZoom){zoom=Math.max(1,Math.min(6,zoom*Number(button.dataset.cDocZoom)));fitExpanded(true);}
    else if(button.hasAttribute('data-c-doc-fit')){zoom=1;fitExpanded();}
  }
  function paintDeck(turn){
    if(!alive||!documents.length||!container.querySelector('.c-doc-orbit'))return;
    visualTurn=turn;
    const count=documents.length,selectedIndex=((Math.floor(turn+.5)%count)+count)%count;
    const chosen=documents[selectedIndex];
    container.querySelectorAll('.c-doc-layer').forEach((layer,i)=>{
      const angle=(i-turn)*Math.PI*2/count,depth=(1+Math.cos(angle))/2;
      const front=i===selectedIndex;
      const x=reduced.matches?Math.sin(i*Math.PI*2/count)*radiusX*.5:Math.sin(angle)*radiusX;
      const y=reduced.matches?-Math.abs(i-selectedIndex)*2:-(1-Math.cos(angle))*radiusY;
      const rotation=reduced.matches?(front?0:(i-selectedIndex)*1.4):Math.sin(angle)*17;
      const scale=reduced.matches?(front?1:.87):.78+.22*depth;
      layer.style.transform='translate3d('+x.toFixed(3)+'px,'+y.toFixed(3)+'px,0) rotate('+rotation.toFixed(3)+'deg) scale('+scale.toFixed(4)+')';
      layer.style.zIndex=String(front?210:Math.round(20+depth*180));
      layer.style.filter='brightness('+(front?1:.62+.25*depth).toFixed(3)+')';
      layer.classList.toggle('c-doc-front',front);layer.classList.toggle('c-doc-behind',!front);
      layer.querySelector('.c-doc-card-select').hidden=front;
      const sheet=layer.querySelector('.c-doc-sheet');sheet.inert=!front;sheet.setAttribute('aria-hidden',String(!front));
      const overlays=layer.querySelector('.c-doc-highlights');overlays.inert=!front;overlays.setAttribute('aria-hidden',String(!front));
    });
    if(selectionKey!==chosen.id){
      selectionKey=documentId=chosen.id;activeHighlight=highlights(chosen)[0]?.id||'';
      container.querySelector('[data-c-doc-source]').textContent=sourceLabel(chosen);
      container.querySelectorAll('.c-doc-tabs [data-c-doc-select]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cDocSelect===documentId)));
      if(resourceMode&&innerWidth<=700&&document.body.classList.contains('resources-active')){
        const tabs=container.querySelector('.c-doc-tabs'),tab=tabs.querySelector('[aria-pressed=true]');
        if(tab)tabs.scrollTo({left:Math.max(0,tab.offsetLeft-(tabs.clientWidth-tab.offsetWidth)/2),behavior:reduced.matches?'instant':'smooth'});
      }
      container.querySelector('.c-doc-footer').innerHTML='<button data-c-doc-toggle aria-pressed="'+showHighlights+'">'+t(showHighlights?'Highlights on':'Highlights off',showHighlights?'高亮已开':'高亮已关')+'</button>'+passageControl(chosen)+'<a href="'+esc(chosen.sourceUrl)+'" target="_blank" rel="noopener">'+t('Original source','原始来源')+' ↗</a>';
      updateExplanation();onChange(chosen,selectedIndex,turn);
    }
    const cycle=container.querySelector('.c-doc-cycle');
    cycle.querySelector('b').textContent=String(selectedIndex+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');
    cycle.querySelector('span').textContent=resourceMode?t('Scroll or select a source','滚动翻阅，或点选资料'):progress>=.995?t('Full circle · continue down','一周已阅 · 继续向下'):t('Scroll to turn · click to read','向下翻阅 · 向上回转');
    container.querySelector('.c-doc-root').style.setProperty('--paper-cycle',String(progress));
  }
  function tickSelection(time){
    manualFrame=0;if(!alive)return;
    const dt=Math.min(50,manualTime?time-manualTime:16.67);manualTime=time;
    visualTurn+=(targetTurn-visualTurn)*(1-Math.exp(-dt/105));
    if(Math.abs(targetTurn-visualTurn)<.0001)visualTurn=targetTurn;
    paintDeck(visualTurn);
    if(visualTurn!==targetTurn)manualFrame=requestAnimationFrame(tickSelection);else manualTime=0;
  }
  function selectDocument(id,immediate=false){
    const index=documents.findIndex(doc=>doc.id===id);if(index<0)return;
    closeExpanded();
    if(onSelect(id,index)===true){
      cancelAnimationFrame(manualFrame);manualFrame=0;manualTime=0;manualOffset=0;targetTurn=index;paintDeck(index);return;
    }
    if(id===documentId&&!manualFrame)return;
    const count=documents.length,delta=((index-visualTurn+count/2)%count+count)%count-count/2;
    targetTurn=visualTurn+delta;manualOffset=targetTurn-scrollTurn;
    if(immediate||reduced.matches||document.hidden){cancelAnimationFrame(manualFrame);manualFrame=0;manualTime=0;paintDeck(targetTurn);return;}
    if(!manualFrame){manualTime=0;manualFrame=requestAnimationFrame(tickSelection);}
  }
  function renderDocument(){
    const doc=current();if(!alive||!doc)return;
    selectionKey='';activeHighlight=highlights(doc)[0]?.id||'';
    container.innerHTML=`<div class="c-doc-root c-doc-stack-root c-doc-orbit">
      <header class="c-doc-header"><div><span data-c-doc-source></span><span class="c-doc-cycle"><b>01 / 08</b><span></span></span></div><button data-c-doc-enlarge>${t('Enlarge page','放大原页')} <b>↗</b></button></header>
      <div class="c-doc-frame c-doc-stack">${documents.map((item,i)=>`<div class="c-doc-layer" data-c-doc-select="${esc(item.id)}">${sheetMarkup(item)}<button class="c-doc-card-select" data-c-doc-select="${esc(item.id)}" aria-label="${t('Read','阅读')} ${esc(title(item))}"><span>${String(i+1).padStart(2,'0')}</span></button></div>`).join('')}</div>
      <div class="c-doc-tabs" role="group" aria-label="${t('Choose an original document','选择一份原始文件')}">${documents.map((item,i)=>`<button data-c-doc-select="${esc(item.id)}" aria-pressed="${item.id===doc.id}"><span>${String(i+1).padStart(2,'0')}</span><span>${esc(text(item.sectionLabel||item.title,lang).replace(/^\d+\s*[·.]\s*/, ''))}</span></button>`).join('')}</div>
      <p class="c-doc-explanation" id="c-doc-explanation-${instance}" aria-live="polite"></p>
      <footer class="c-doc-footer"></footer>
    </div>`;
    fitStage();
  }
  function onKey(event){
    const target=event.target.closest('button[data-c-doc-select]');if(!target||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const i=documents.findIndex(doc=>doc.id===target.dataset.cDocSelect),next=event.key==='Home'?0:event.key==='End'?documents.length-1:(i+(event.key==='ArrowRight'?1:documents.length-1))%documents.length;
    selectDocument(documents[next].id);container.querySelector(`.c-doc-tabs [data-c-doc-select="${documents[next].id}"]`)?.focus({preventScroll:true});
  }

  container.addEventListener('click',onClick);container.addEventListener('focusin',onFocus);container.addEventListener('keydown',onKey);
  const ready=fetch(manifestUrl).then(response=>{if(!response.ok)throw new Error(`Document manifest: ${response.status}`);return response.json();}).then(manifest=>{
    if(!alive)return;
    documents=(Array.isArray(manifest)?manifest:manifest.documents||manifest.docs||[]).filter(doc=>doc.id&&doc.image&&doc.sourceUrl&&Number.isFinite(doc.width)&&doc.width>0&&Number.isFinite(doc.height)&&doc.height>0);
    if(!documents.length)throw new Error('No original pages are available');
    if(!current())documentId=documents[0].id;
    scrollTurn=Math.min(resourceMode?Math.max(0,documents.length-1):documents.length,Math.max(0,Math.min(1,(progress-.025)/.95))*documents.length);visualTurn=targetTurn=scrollTurn+manualOffset;renderDocument();onReady(documents);resizeObserver=new ResizeObserver(fitStage);resizeObserver.observe(container);
  }).catch(error=>{
    console.error('Original document collection could not open',error);
    if(alive)container.innerHTML=`<div class="c-doc-loading" role="status">${t('Open this chapter again to refresh the document collection.','再次打开本章，刷新原始文件集。')}</div>`;
  });
  return {
    ready,
    setProgress(value){
      progress=Math.max(0,Math.min(1,value));scrollTurn=Math.min(resourceMode?Math.max(0,documents.length-1):documents.length,Math.max(0,Math.min(1,(progress-.025)/.95))*documents.length);
      targetTurn=scrollTurn+manualOffset;
      if(!expanded&&!manualFrame)paintDeck(targetTurn);
    },
    setDocument(id){selectDocument(id);},
    getSelectedDocument(){return documentId||null;},
    setSelectedDocument(id){return ready.then(()=>{if(alive)selectDocument(id,true);});},
    destroy(){
      alive=false;cancelAnimationFrame(manualFrame);resizeObserver?.disconnect();closeExpanded();
      container.removeEventListener('click',onClick);container.removeEventListener('focusin',onFocus);container.removeEventListener('keydown',onKey);
    }
  };
}
