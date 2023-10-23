/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import {  useContext, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SelectBoxPropertiesContext } from '../App';
import { type ContextType } from '../App';


type Props = {
    name : string ,
    options : number[]
  }

  

export function SelectBox ( { name  ,  options  } : Props )  {
    const [value, setValue] = useState('');
    const text = name === "Quality" ? "%" : "px"
    const {  setProps } = useContext(SelectBoxPropertiesContext) as ContextType
  
    const handleChange = (e: SelectChangeEvent) => {
      const newValue = e.target.value as string | number;
      setValue(newValue as string)
      
       if (name === "Quality") setProps((i) =>  ({...i,quality:newValue as number   } ) )
       if (name === "Height") setProps((i)  => ({...i,height: newValue as number  }))
       if (name === "Width") setProps((i) => ({...i,width: newValue as number  }))
    }
   
    return (
      <Box  className="w-40" sx={{ Width: 120  , height : 50}}>
        <FormControl  fullWidth>
          <InputLabel  id="demo-simple-select-label" sx={{ color: "#365ca7" , fontFamily : "Oswald" , fontSize: "20px"}}>{name}</InputLabel>
          <Select 
          sx={{ color : "rgb(74,222,128)" ,fontFamily : "Oswald" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={name}
            onChange={handleChange}
            
          >
            { options &&  options.map( (e:number , index:number) => {
              return <MenuItem   sx={{color: "rgb(59 130 246)" , fontFamily : "Oswald"}} 
              id='hello' key={index} value={e} >{name === "Quality" ? e*100 : e } 
              {text}
              </MenuItem>
            })}
          
          </Select>
        </FormControl>
      </Box>
    );
  }
  