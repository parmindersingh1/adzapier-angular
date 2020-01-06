import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-useractivity',
  templateUrl: './useractivity.component.html',
  styleUrls: ['./useractivity.component.scss']
})
export class UseractivityComponent implements OnInit {

  userdata =[  
    {SrNo:'1',Description:'user rohannj982@gmail.com login @ 50.238.195 ',Date:'2019-30-12 16:42:12'},  
    {SrNo:'2',Description:'user rohannj982@gmail.com logout @ 60.195.275',Date:'2019-30-12 16:56:40'},  
    {SrNo:'3',Description:'user rohannj982@gmail.com login @ 67.128.956',Date:'2019-31-12 17:40:30'},  
    {SrNo:'4',Description:'user rohannj982@gmail.com updated https://mykingfresh.com',Date:'2019-31-12 17:40:30'},  
    {SrNo:'5',Description:'user rohannj982@gmail.com login @ 50.238.195 ',Date:'2019-30-12 16:42:12'},  
    {SrNo:'6',Description:'user rohannj982@gmail.com logout @ 60.195.275',Date:'2019-30-12 16:56:40'},  
    {SrNo:'7',Description:'user rohannj982@gmail.com login @ 67.128.956',Date:'2019-31-12 17:40:30'},  
    {SrNo:'8',Description:'user rohannj982@gmail.com updated https://mykingfresh.com',Date:'2019-31-12 17:40:30'}, 
    {SrNo:'9',Description:'user rohannj982@gmail.com login @ 50.238.195 ',Date:'2019-30-12 16:42:12'},  
    {SrNo:'10',Description:'user rohannj982@gmail.com logout @ 60.195.275',Date:'2019-30-12 16:56:40'},  
    
]

  constructor() { }

  ngOnInit() {
  }

}
