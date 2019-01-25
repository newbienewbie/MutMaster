
class LangControl{
    constructor(container,langs=[]){
        this.props= {
            langs: langs || [],
        };
        this.state={
            gender:"Female",
            region: "Chinese (Mainland)",
            voice : null,
        };
        this.form = this._initialize();
        container.appendChild(this.form);
    }

    _createSelectElement( array=[{value:null, text:null}], onchange=null ){
        var selectElement= document.createElement("select");

        array.forEach(i=>{
            var optElement= document.createElement("option");
            optElement.value=i.value;
            optElement.textContent= i.text;
            selectElement.appendChild(optElement);
        });

        if(!!onchange){
            selectElement.onchange= e=>{
                e.preventDefault();
                onchange(e.target.value);
                return false;
            }
        }

        return selectElement;
    }


    _createOptElements( array=[{value:null, text:null}]){
        return array.map(i=>{
            var optElement= document.createElement("option");
            optElement.value=i.value;
            optElement.textContent= i.text;
            return optElement;
        });
    }

    _initialize(){

        var form=document.createElement("form");

        // gender
        var genders=[
            {value:'Female',text:"女性"},
            {value:'Male',text:"男性"},
        ];
        var genderSelector= this._createSelectElement(genders,(v)=>{
            console.log(`gender selector change`,v);
            this.state.gender=v;
            this.render();
        });
        genderSelector.setAttribute("name","gender");
        genderSelector.setAttribute("id","genderSelector");
        genderSelector.setAttribute("class","form-control");
        // create label
        var genderLabel = this._createLabel("genderSelector","性别");
        var genderGroup = this._createFormGroup(genderLabel,genderSelector);
        form.appendChild(genderGroup);


        // region 
        var languages = [
            {value:'Chinese (Mainland)',text:'中国大陆'},
            {value:'Chinese (Hong Kong)',text:'中国香港'},
            {value:'Chinese (Taiwan)',text:'中国台湾'},
        ];
        var languageSelector = this._createSelectElement(languages, v=>{
            this.state.region = v;
            this.render();
        });
        languageSelector.setAttribute("name","region");
        languageSelector.setAttribute("id","languageSelector");
        languageSelector.setAttribute("class","form-control");
        var languageLabel = this._createLabel("languageSelector","地区");
        var languageGroup = this._createFormGroup(languageLabel,languageSelector);
        form.appendChild(languageGroup);


        // initial voice selector
        this.voiceSelector = this._createEmptyVoiceSelector();
        const voiceSelectorLabel = this._createLabel("voiceSelector","语音");
        var voiceGroup = this._createFormGroup(voiceSelectorLabel,this.voiceSelector);
        form.appendChild(voiceGroup);

        // trigger once when initializing
        this.render();

        return form;
    }

    _createLabel(labelFor,text){
        var label = document.createElement("label");
        label.setAttribute("for",labelFor);
        label.textContent= text;
        label.setAttribute("class","col-sm-2 col-form-label");
        return label;
    }

    _createFormGroup(label,control){
        var wrapper=document.createElement("div");
        wrapper.setAttribute("class","form-group row");

        wrapper.appendChild(label);

        var controlWrapper= document.createElement("div");
        controlWrapper.setAttribute("class","col-sm-10");
        controlWrapper.appendChild(control);

        wrapper.appendChild(controlWrapper);
        return wrapper;
    }
    
    _createEmptyVoiceSelector(){
        // voice 
        var voiceSelector = document.createElement("select");
        voiceSelector.setAttribute("name","voice");
        voiceSelector.setAttribute("class","form-control");
        voiceSelector.onchange = e =>{
            e.preventDefault();
            console.log("voice changed",e);
            this.state.voice = e.target.value;
            console.log(this.state);
            return false;
        };
        return voiceSelector;
    }
    _filterVoices(){
        return this.props.langs
            .filter(l => 
                ( this.state.region == null || l.language == this.state.region) 
                && ( this.state.gender == null || l.gender== this.state.gender) 
            )
            .map(i=>{return { value:i.voice, text: i.voice } ;})
            ;
    }
    render(){
        var voices = this._filterVoices();
        this.voiceSelector.innerHTML = "";
        this._createOptElements(voices).forEach(v =>{
            this.voiceSelector.appendChild(v);
        });
        if(voices.length>=1){
            this.state.voice = voices[0].value;
        }
    }
}

