import {rentalOwner} from './rental-people.js?v=1';
const STAGES=['waiting','spill','comfort','soft','dry','borrowed'];
export function registerKitchenLayers(backgrounds,sprites){
 for(const person of ['dragan','jelena'])for(const stage of ['coffee','spill','comfort','soft','dry','borrowed'])delete backgrounds[`${person}-kitchen-${stage}`];
 backgrounds['kitchen-common-layer-v1']={label:'Кухня',description:'Кухня с деревянным столом у окна',position:'50% 0%'};
 // The borrowed top comes in two colours; the layers are the original pose re-lit by tools/art/recolor-dragan-tee.py.
 for(const top of ['grey','white'])sprites.dragan['kitchen-borrowed-'+top]={file:`dragan-kitchen-borrowed-layer-${top}-v1`,alt:`Драган на кухне в ${top==='grey'?'серой':'белой'} футболке Under Armour`};
 for(const person of ['dragan','jelena'])for(const stage of STAGES)sprites[person]['kitchen-'+stage]={file:`${person}-kitchen-${stage}-layer-${stage==='comfort'?'v2':'v1'}`,alt:person==='dragan'?'Драган на кухне':'Йелена на кухне'};
}
export function kitchenPresentation(node,page,flags={}){
 const stage=page.kitchenStage??node.kitchenStage;if(!stage)return null;
 const owner=node.districtPortrait&&rentalOwner(flags);
 if(owner)return {bg:'kitchen-common-layer-v1',description:'Кухня с деревянным столом у окна',position:'50% 0%',insert:false,seated:false,composite:false,kitchenLayers:false,location:'КВАРТИРА · КОФЕ НА КУХНЕ',time:page.time??node.time,character:owner,contactPortrait:null,emotion:'friendly',daydream:false};
 const person=(node.districtPortrait?flags.districtOwner:flags.host)==='jelena'?'jelena':'dragan';
 const mood=stage==='coffee'?'waiting':stage==='spill'&&node===dryNode?'soft':stage;
 return {bg:'kitchen-common-layer-v1',description:'Кухня с деревянным столом у окна',position:'50% 0%',insert:false,seated:false,composite:false,kitchenLayers:true,location:'КВАРТИРА · КОФЕ НА КУХНЕ',time:page.time??node.time,character:person,contactPortrait:null,emotion:'kitchen-'+(mood==='borrowed'&&person==='dragan'&&['grey','white'].includes(flags.hostTop)?'borrowed-'+flags.hostTop:mood),occludeTable:!['comfort','waiting'].includes(mood),daydream:false};
}
let dryNode;
export function rememberKitchenNodes(nodes){dryNode=nodes.host_coffee_change;}
