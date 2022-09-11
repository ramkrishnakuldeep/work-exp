import '../image.scss';

const ImageUpload =({ onChange, src }: {onChange: any, src: string})=>
    <label htmlFor="photo-upload" className="custom-file-upload fas">
      <div className="img-wrap img-upload" >
        <img id="photo-upload" src={src} alt="img"/>
      </div>
      <input id="photo-upload" type="file" onChange={onChange}/> 
    </label>
  

  export default ImageUpload