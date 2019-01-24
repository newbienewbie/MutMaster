
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

        // initial voice selector
        this.voiceSelector = this._createEmptyVoiceSelector();
        const voiceSelectorLabel = this._createLabel("voiceSelector","语音");
        this.form.appendChild(voiceSelectorLabel);
        this.form.appendChild(this.voiceSelector);
        this.render();
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
        // create label
        var genderLabel = document.createElement("label");
        genderLabel.setAttribute("for","genderSelector");
        genderLabel.textContent= "性别";
        var genderSelectorWrapper= 
        form.appendChild(genderLabel);
        form.appendChild(genderSelector);


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
        var languageLabel = document.createElement("label");
        languageLabel.setAttribute("for","languageSelector");
        languageLabel.textContent= "地区";
        form.appendChild(languageLabel);
        form.appendChild(languageSelector);

        return form;
    }

    _createLabel(labelFor,text){
        var label = document.createElement("label");
        label.setAttribute("for",labelFor);
        label.textContent= text;
        return label;
    }
    
    _createEmptyVoiceSelector(){
        // voice 
        var voiceSelector = document.createElement("select");
        voiceSelector.setAttribute("name","voice");
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

