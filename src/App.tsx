/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import Compressor from "compressorjs"
import React, { useState , useEffect, createContext} from "react"
import { ThemeProvider } from "@mui/material/styles"
import { createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { SelectBox } from "./Components/SelectBox"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import GetAppIcon from '@mui/icons-material/GetApp';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import CollectionsIcon from '@mui/icons-material/Collections';
import ForwardIcon from '@mui/icons-material/Forward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';



type Info = {
  imageSize : number | null ,
  compressedImageSize : number | null
}


export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})
export type Properties = {
  quality : number ,
  width : number ,
  height : number ,

}

export type ContextType = {
  props: Properties;
  setProps: React.Dispatch<React.SetStateAction<Properties>>;
}


export const SelectBoxPropertiesContext = createContext<ContextType | undefined>(undefined)

function App() { 
  const [image , setImage] = useState< any  >()
  const [ props, setProps ] = useState<Properties>({quality: .6 , width : 1900 , height : 1900 })
  const [ inputValue , setInputValue] = useState<string[] | string | null>("")
  const [ width ,setWidth ] = useState<number>(0)
  const [ error , setError] = useState<string | null>(null)
  const [ info , setInfo] = useState<Info>({ imageSize : null , compressedImageSize : null })

 
 function handleFileUpload(e:React.ChangeEvent) {
     

      e.preventDefault()
      const target = e.currentTarget as HTMLInputElement
      const file = target?.files?.[0]
      if (file) setInputValue(file.name)
   
      try {
        
        const selectedFile = target?.files?.[0] 
        if (!selectedFile) return
        if (!selectedFile.type.startsWith('image/')) {

          setError("File must be an Image")
          return
        }
       
        setInputValue(selectedFile.name)
        setInfo({...info , imageSize: selectedFile.size})
        new Compressor(selectedFile, {
          quality: props?.quality,
          width: props?.width,
          height: props?.height,
        
          success(result) {
            setImage(result)
            setWidth(0)
            setError(null)
            setInfo( e => ({...e , compressedImageSize: result.size}))
          
          
          },
          error(err)  {
            setError('Error compressing the image: ' + err.message)
          }
        })
      }
      catch (err) {
        setError('Error uploading the file: ' + (err as Error).message)
      }
    }

function handleDropFile(e: React.DragEvent) {
    const target = e.target as HTMLElement
    if (e.target) target.style.background = "rgb(59,130,246)"
    e.preventDefault()
    async function init() {
      try{

        const files = e.dataTransfer?.files
        const droppedFile = files?.[0]
        
        setInputValue(droppedFile?.name)
        if (!droppedFile?.type.startsWith('image/')) {
  
          setError("File must be an Image")
          return
        }
     
        setInfo({...info , imageSize: droppedFile.size})
        new Compressor(droppedFile, {
          quality: props?.quality,
          width: props?.width,
          height: props?.height,
          success(result) {
            setImage(result)
            setWidth(0)
            setError(null)
            setInfo( e => ({...e , compressedImageSize: result.size}))
         
          },
          error(err) {
            setError('Error compressing the image: ' + err.message)
          }
        })
      }catch (err) {
        setError('Error uploading the file: ' + (err as Error).message)
      }
    }
    init()
  }

  function handleDrag(e: React.MouseEvent) {
    const target = e.target as HTMLElement
    target.style.background = "rgb(74 222 128)"
    e.preventDefault()

  }

  useEffect(() => {
    if (!image) return
    if (width >= 100) return
    const progressBar = setInterval(() => {
      setWidth(e => e + 0.5)
    }, 5)

    return () => clearInterval(progressBar)
  }, [width, image]) 

function formatedSize (size : number) : string {
  const KB = size/1024 
  const finalSize = KB > 1024 ? ((KB/1024).toFixed(2))+" MB": (KB).toFixed(2) +" KB" 
  return finalSize
}

return (
    <>
      <header className=" w-full bg-blue-500 p-2">
        <h4 className="m-0 text-gray-100" > Transform Your Images: High-Quality Compression Made Simple! <CollectionsIcon sx={{ scale: "1.3", marginLeft: "1em" }}></CollectionsIcon></h4>
      </header>

      <main className="flex w-[100vw] flex-col items-center">
        <SelectBoxPropertiesContext.Provider value={{ props ,  setProps }}>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline></CssBaseline>

            <section className="h-screen max-w-[700px] mt-6 p-0">
              {/*//////  SELECT BOX ///// */}
              <div className="options-container">
                <div className="flex  gap-4 justify-center" >

                  <SelectBox name="Quality" options={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]} ></SelectBox>
                  <SelectBox name="Width" options={[600, 900, 1200, 1500, 1900, 2100]} ></SelectBox>
                  <SelectBox name="Height" options={[600, 900, 1200, 1500, 1900, 2100]} ></SelectBox>

                </div>
                {/*//////  UPLOAD IMAGE INPUT (LABEL) ///// */}
                <div className="flex flex-col items-center justify-center  p-10">
                  <label id="container" htmlFor="file" className="bg-blue-500 py-4 px-8 gap-3 rounded cursor-pointer hover:bg-blue-400 flex items-center justify-between">Upload File
                    <CloudUploadIcon sx={{ scale: "1.2" }}></CloudUploadIcon>
                    <input  className="items-center hidden " type="file" id="file" accept="images/*"
                 
                      onChange={handleFileUpload}
                      onClick={ (e) => {
                        const target = e.target as HTMLInputElement
                        target.value = ""
                        setError(null)
                        setImage(null)
                        setInputValue(null)
                        setWidth(0)

                      } }>
                    </input>
                  </label>

                </div>
              </div>
              {/*//////   DROP IMAGE CONTAINER ///// */}
              <label htmlFor="file" onDragOver={handleDrag} onClick={(e) => e.preventDefault()} onDrop={handleDropFile}
                onDragLeave={(e) => (e.target as HTMLLabelElement).style.background = "rgb(59,130,246)"}
                onDragEnd={(e) => (e.target as HTMLLabelElement).style.background = "red"} >
                <div className="bg-blue-600 w-[700px] relative h-[260px] mx-auto flex flex-col items-center rounded-3xl hover:bg-blue-500 mt-[-10px]"  >
                  <p className=" absolute pointer-events-none">Drop your image here</p>
                  <CloudUploadIcon className="pointer-events-none" sx={{ scale: "8", marginTop: "130px" }}></CloudUploadIcon>
                </div>
                {/*//////   PROGRESS BAR ///// */}
                {width != 0 && !error && <div className="progress-bar w-full h-3 bg-gray-400 mt-6 rounded-lg" >
                  <div style={{ width: `${width}%` }}
                    className="bg-green-600 h-full  rounded-lg ">
                  </div>
                </div>
                }
              </label>
              {/*//////   FILE NAME AND FINISH ICON ///// */}
              <div className=" flex flex-col items-center pt-4">
                <div className="flex  items-center justify-center w-full ">
                  {inputValue && <p className="text-start relative  text-[16px] ">{inputValue} {width === 100 ? <FileDownloadDoneIcon className="absolute ml-1" sx={{ bgcolor: "green", visibility: error ? "hidden" : "" }}></FileDownloadDoneIcon> : ""}
                  </p>}
                </div>
                {/*//////   FROM -> TO  ///// */}
                {width === 100 && !error &&
                  <div className="pt-4">
                    <span> From : {info.imageSize && formatedSize(info.imageSize)}  <ForwardIcon sx={{ color: "rgb(34 ,197 ,94)", scale: "1.5", marginLeft: ".3em" }}></ForwardIcon></span>
                    <span> To : {info.compressedImageSize && formatedSize(info.compressedImageSize)} </span>
                  </div>
                }
                {/*//////   ERROR MESSAGE  AND DOWNLOAD LINK  ///// */}
                {error && inputValue ?
                  <>
                    <ArrowUpwardIcon sx={{ scale: "2", color: "rgb(239 68 68)", marginTop: "1em" }}></ArrowUpwardIcon>
                    <h1 className="text-red-500 font-bold mt-0"> File must be an Image !!</h1> </>
                  : image && inputValue && width === 100 && <a href={URL.createObjectURL(image)} download={image?.name}
                    onClick={() => {
                      setWidth(0)
                      setImage(null)
                    }}
                    className="py-4 px-8 mt-4 bg-green-600 text-gray-white font-bold rounded hover:bg-green-500 "
                  >Download <GetAppIcon></GetAppIcon></a>}
              </div>
            </section>
              {/*//////   INFORMATION SECTION  ///// */}
            <section className="max-w-[700px] text-left flex flex-col  leading-relaxed text-blue-400 pb-4">
              <h2 className="text-green-400">Why compress images ?</h2>
              <hr className="bg-green-400 h-1 rounded-lg w-[80%]  "></hr>
              <p>
                Compressing images is essential for several reasons. Firstly,
                it helps save valuable space on devices like smartphones and tablets,
                allowing users to store more photos and apps without running out of room.
                Additionally, compressed images make websites load faster, which is crucial for providing a smooth
                browsing experience, especially on mobile devices with limited data connections.
                This not only keeps users engaged but also saves their data plans from being unnecessarily consumed.
                In essence, image compression ensures that visuals remain sharp and engaging while also being kind to both
                device storage and data allowances.
              </p>

              <h2 className="text-green-400">How does it work ? </h2>
              <hr className="bg-green-400 h-1 rounded-lg w-[80%]  "></hr>
              <p> Image compression works by reducing the size of image files while trying to
                maintain their visual quality. It achieves this by identifying and removing redundancies
                in the image data. One common method is to analyze areas of the image where colors or
                details are similar and represent them more efficiently. Another approach is to use
                mathematical techniques to encode the image in a way that requires fewer bits to store.
                This reduction in file size allows images to load faster on websites and consume less storage space,
                without significantly compromising how they look to the human eye.
              </p>

            </section>
          </ThemeProvider>
        </SelectBoxPropertiesContext.Provider>

      </main>
    </>
  )
}
export default App
