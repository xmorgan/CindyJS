geoOps={};
geoOps._helper={};

var geoOps = {};
geoOps._helper = {};
var geoOpMap = {};


geoOps.Join =function(el){
    var el1=csgeo.csnames[(el.args[0])];
    var el2=csgeo.csnames[(el.args[1])];
    el.homog=List.cross(el1.homog,el2.homog);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";  
};
geoOpMap.Join="L";


geoOps.Segment =function(el){
    var el1=csgeo.csnames[(el.args[0])];
    var el2=csgeo.csnames[(el.args[1])];
    el.homog=List.cross(el1.homog,el2.homog);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";  
};
geoOpMap.Segment="S";



geoOps.Meet =function(el){
    var el1=csgeo.csnames[(el.args[0])];
    var el2=csgeo.csnames[(el.args[1])];
    el.homog=List.cross(el1.homog,el2.homog);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Point";  
};

geoOps.Meet.visiblecheck=function(el){
    var visible=true;  
    var el1=csgeo.csnames[(el.args[0])];
    var el2=csgeo.csnames[(el.args[1])];
    
    if(el1.type==="Segment") {
        visible=onSegment(el,el1);
    } 
    if(visible && el1.type==="Segment") {
        visible=onSegment(el,el2);
    }
    el.isshowing=visible;
};

geoOpMap.Meet="P";



geoOps.Mid =function(el){
    var x=csgeo.csnames[(el.args[0])].homog;
    var y=csgeo.csnames[(el.args[1])].homog;
    
    var line=List.cross(x, y);
    var infp=List.cross(line, List.linfty);
    var ix= List.det3(x, infp, line);
    var iy= List.det3(y, infp, line);
    var z1=List.scalmult(iy,x);
    var z2=List.scalmult(ix,y);
    el.homog=List.add(z1,z2);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Point";      
};
geoOpMap.Mid="P";


geoOps.Perp =function(el){
    var l=csgeo.csnames[(el.args[0])].homog;
    var p=csgeo.csnames[(el.args[1])].homog;
    var inf=List.linfty;
    var tt=List.cross(inf,l);
    tt.value=[tt.value[1],CSNumber.neg(tt.value[0]),tt.value[2]];
    el.homog=List.cross(tt,p);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";
};
geoOpMap.Perp="L";


geoOps.Para =function(el){
    var l=csgeo.csnames[(el.args[0])].homog;
    var p=csgeo.csnames[(el.args[1])].homog;
    var inf=List.linfty;
    el.homog=List.cross(List.cross(inf,l),p);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";
};
geoOpMap.Para="L";

geoOps.Horizontal =function(el){
    var el1=csgeo.csnames[(el.args[0])];
    el.homog=List.cross(List.ex,el1.homog);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";  
};
geoOpMap.Horizontal="L";

geoOps.Vertical =function(el){
    var el1=csgeo.csnames[(el.args[0])];
    el.homog=List.cross(List.ey,el1.homog);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";  
};
geoOpMap.Vertical="L";


geoOps.Through =function(el){
    var el1=List.normalizeZ(csgeo.csnames[(el.args[0])].homog);
    
    if(move && move.mover===el){
        var xx=el1.value[0].value.real-mouse.x+move.offset.x;
        var yy=el1.value[1].value.real-mouse.y+move.offset.y;
        el.dir=List.realVector([xx,yy,0]);
    }

    el.homog=List.cross(el.dir,el1);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Line";  
};
geoOpMap.Through="L";


geoOps.Free =function(el){
    
};
geoOpMap.Free="P";

geoOps.PointOnLine =function(el){
    var l=csgeo.csnames[(el.args[0])].homog;
    var p=el.homog;
    var inf=List.linfty;
    var tt=List.cross(inf,l);
    tt.value=[tt.value[1],CSNumber.neg(tt.value[0]),tt.value[2]];
    var perp=List.cross(tt,p);
    el.homog=List.cross(perp,l);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Point";
    //TODO: Handle complex and infinite Points
    var x=CSNumber.div(el.homog.value[0],el.homog.value[2]);
    var y=CSNumber.div(el.homog.value[1],el.homog.value[2]);
    el.sx=x.value.real;
    el.sy=y.value.real;
    el.sz=1;
};
geoOpMap.PointOnLine="P";



geoOps.PointOnCircle =function(el){//TODO was ist hier zu tun damit das stabil bei tracen bleibt

    var c=csgeo.csnames[(el.args[0])];
    var pts=geoOps._helper.IntersectLC(List.linfty,c.matrix);
    var ln1=General.mult(c.matrix,pts[0]);
    var ln2=General.mult(c.matrix,pts[1]);
    var mid=List.normalizeZ(List.cross(ln1,ln2));
 
    if(move && move.mover===el){
        var xx=mid.value[0].value.real-mouse.x-move.offset.x;
        var yy=mid.value[1].value.real-mouse.y-move.offset.y;
        el.angle=CSNumber.real(Math.atan2(-yy,-xx));
 
    }
    
    var angle=el.angle;

    var pt=List.turnIntoCSList([CSNumber.cos(angle),CSNumber.sin(angle),CSNumber.real(0)]);
    pt=List.scalmult(CSNumber.real(10),pt);
    pt=List.add(mid,pt);

    var ln=List.cross(pt,mid);
    var ints=geoOps._helper.IntersectLC(ln,c.matrix);//TODO richtiges Tracing einbauen!!!
    var int1=List.normalizeZ(ints[0]);
    var int2=List.normalizeZ(ints[1]);
    var d1=List.abs2(List.sub(pt,int1));
    var d2=List.abs2(List.sub(pt,int2));
   
    var erg=ints[0];
    if(d1.value.real>d2.value.real){erg=ints[1];}


    el.homog=erg;
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Point";

    
    //TODO: Handle complex and infinite Points
    var x=CSNumber.div(el.homog.value[0],el.homog.value[2]);
    var y=CSNumber.div(el.homog.value[1],el.homog.value[2]);
    
    el.sx=x.value.real;
    el.sy=y.value.real;
    el.sz=1;
};
geoOpMap.PointOnCircle="P";



geoOps.PointOnSegment =function(el){//TODO was ist hier zu tun damit das stabil bei tracen bleibt
    
    var l=csgeo.csnames[(el.args[0])].homog;
    var el1=csgeo.csnames[csgeo.csnames[(el.args[0])].args[0]].homog;
    var el2=csgeo.csnames[csgeo.csnames[(el.args[0])].args[1]].homog;
    var elm=el.homog;
    
    var xx1=CSNumber.div(el1.value[0],el1.value[2]);
    var yy1=CSNumber.div(el1.value[1],el1.value[2]);
    var xx2=CSNumber.div(el2.value[0],el2.value[2]);
    var yy2=CSNumber.div(el2.value[1],el2.value[2]);
    var xxm=CSNumber.div(elm.value[0],elm.value[2]);
    var yym=CSNumber.div(elm.value[1],elm.value[2]);
    var par;
    if(!move || move.mover===el){
        
        var p=el.homog;
        var inf=List.linfty;
        var tt=List.cross(inf,l);
        tt.value=[tt.value[1],CSNumber.neg(tt.value[0]),tt.value[2]];
        var perp=List.cross(tt,p);
        el.homog=List.cross(perp,l);
        el.homog=List.normalizeMax(el.homog);
        el.homog.usage="Point";
        
        
        
        
        var x1=xx1.value.real;
        var y1=yy1.value.real;
        var x2=xx2.value.real;
        var y2=yy2.value.real;
        var xm=xxm.value.real;
        var ym=yym.value.real;
        var d12=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        var d1m=Math.sqrt((x1-xm)*(x1-xm)+(y1-ym)*(y1-ym));
        var d2m=Math.sqrt((x2-xm)*(x2-xm)+(y2-ym)*(y2-ym));
        var dd=d12-d1m-d2m;
        par=d1m/d12;
        if (d1m>d12) par=1;
        if (d2m>d12) par=0;
        el.param=CSNumber.real(par);
        
    }
    
    par=el.param;
    
    var diffx=CSNumber.sub(xx2,xx1);
    var ergx=CSNumber.add(xx1,CSNumber.mult(el.param,diffx));
    var diffy=CSNumber.sub(yy2,yy1);
    var ergy=CSNumber.add(yy1,CSNumber.mult(el.param,diffy));
    var ergz=CSNumber.real(1);
    el.homog=List.turnIntoCSList([ergx,ergy,ergz]);
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Point";

    
    //TODO: Handle complex and infinite Points
    var x=CSNumber.div(el.homog.value[0],el.homog.value[2]);
    var y=CSNumber.div(el.homog.value[1],el.homog.value[2]);
    
    el.sx=x.value.real;
    el.sy=y.value.real;
    el.sz=1;
};
geoOpMap.PointOnSegment="P";



geoOps._helper.CenterOfConic =function(c){
        var pts=geoOps._helper.IntersectLC(List.linfty,c);
        var ln1=General.mult(c,pts[0]);
        var ln2=General.mult(c,pts[1]);

        var erg=List.cross(ln1,ln2);

        return erg;
};

geoOps.CenterOfConic =function(el){
    var c=csgeo.csnames[(el.args[0])].matrix;
    var erg=geoOps._helper.CenterOfConic(c);
    el.homog=erg;
    el.homog=List.normalizeMax(el.homog);
    el.homog.usage="Point";


};
geoOpMap.CenterOfConic="P";

geoOps._helper.CircleMP=function(m,p){
    var l1=List.crossOperator(m);
    var l2=List.transpose(l1);
    
    
    var tang=General.mult(l2,General.mult(List.fundDual,l1));
    var mu=General.mult(General.mult(p,tang),p);
    var la=General.mult(General.mult(p,List.fund),p);
    var m1=General.mult(mu,List.fund);
    var m2=General.mult(la,tang);
    var erg=List.sub(m1,m2);
    return erg;
};

geoOps.CircleMP =function(el){//TODO Performance Checken. Das ist jetzt der volle CK-ansatz
                                //Weniger Allgemein geht das viiiiel schneller
    var m=csgeo.csnames[(el.args[0])].homog;
    var p=csgeo.csnames[(el.args[1])].homog;
    el.matrix=geoOps._helper.CircleMP(m,p);
    el.matrix=List.normalizeMax(el.matrix);
    el.matrix.usage="Circle";
    
};
geoOpMap.CircleMP="C";


geoOps.CircleMr =function(el){
    var m=csgeo.csnames[(el.args[0])].homog;
    var mid=List.scaldiv(m.value[2],m);
    if(move && move.mover===el){
        var xx=mid.value[0].value.real-mouse.x;
        var yy=mid.value[1].value.real-mouse.y;
        var rad=Math.sqrt(xx*xx+yy*yy);//+move.offsetrad;
        el.radius=CSNumber.real(rad+move.offsetrad);
    }
    var r=el.radius;
    var p=List.turnIntoCSList([r,CSNumber.real(0),CSNumber.real(0)]);
    p=List.add(p,mid);   
    el.matrix=geoOps._helper.CircleMP(mid,p);
    el.matrix=List.normalizeMax(el.matrix);
    el.matrix.usage="Circle";
    
};
geoOpMap.CircleMr="C";



geoOps.CircleMFixedr =function(el){
    var m=csgeo.csnames[(el.args[0])].homog;
    var mid=List.scaldiv(m.value[2],m);

    var r=el.radius;
    var p=List.turnIntoCSList([r,CSNumber.real(0),CSNumber.real(0)]);
    
    el.matrix=geoOps._helper.CircleMP(mid,p);
    el.matrix=List.normalizeMax(el.matrix);
    el.matrix.usage="Circle";
    
};
geoOpMap.CircleMFixedr="C";



geoOps._helper.ConicBy5 =function(el,a,b,c,d,p){

    var v23=List.turnIntoCSList([List.cross(b, c)]);
    var v14=List.turnIntoCSList([List.cross(a, d)]);
    var v12=List.turnIntoCSList([List.cross(a, b)]);
    var v34=List.turnIntoCSList([List.cross(c, d)]);
    var deg1=General.mult(List.transpose(v14),v23);

    var deg2=General.mult(List.transpose(v34),v12);
    deg1=List.add(deg1,List.transpose(deg1));
    deg2=List.add(deg2,List.transpose(deg2));
    var mu=General.mult(General.mult(p,deg1),p);
    var la=General.mult(General.mult(p,deg2),p);
    var m1=General.mult(mu,deg2);
    var m2=General.mult(la,deg1);

    var erg=List.sub(m1,m2);
    return erg;
};


geoOps.ConicBy5 =function(el){
    var a=csgeo.csnames[(el.args[0])].homog;
    var b=csgeo.csnames[(el.args[1])].homog;
    var c=csgeo.csnames[(el.args[2])].homog;
    var d=csgeo.csnames[(el.args[3])].homog;
    var p=csgeo.csnames[(el.args[4])].homog;

    var erg=geoOps._helper.ConicBy5(el,a,b,c,d,p);

    el.matrix=erg;
    el.matrix=List.normalizeMax(el.matrix);
    el.matrix.usage="Conic";
};
geoOpMap.ConicBy5="C";

geoOps._helper.buildConicMatrix = function(arr){
    var a = arr[0];
    var b = arr[1];
    var c = arr[2];
    var d = arr[3];
    var e = arr[4];
    var f = arr[5];

    var M = List.turnIntoCSList([
	        List.turnIntoCSList([a,b,d]),
	        List.turnIntoCSList([b,c,e]),
	        List.turnIntoCSList([d,e,f])
    		]);
    return M;
};

geoOps._helper.splitDegenConic = function(mat){
    var adj_mat = List.adjoint3(mat);

    var idx = 0, k, l;
    var max = CSNumber.abs(adj_mat.value[0].value[0]).value.real;
    for(k = 1; k < 3; k++){
    	if(CSNumber.abs(adj_mat.value[k].value[k]).value.real > max){
    		idx = k;
    		max = CSNumber.abs(adj_mat.value[k].value[k]).value.real;
    	}
    }
    
    var beta = CSNumber.sqrt(CSNumber.mult(CSNumber.real(-1),adj_mat.value[idx].value[idx]));
    idx = CSNumber.real(idx+1);
    var p = List.column(adj_mat,idx);
    if(CSNumber.abs(beta).value.real < 10e-8){
	    return nada;
    }

    p = List.scaldiv(beta,p);

    
    var lam = p.value[0], mu = p.value[1], tau = p.value[2];
    var M = List.turnIntoCSList([
	    List.turnIntoCSList([CSNumber.real(0), tau, CSNumber.mult(CSNumber.real(-1),mu)]),
	    List.turnIntoCSList([CSNumber.mult(CSNumber.real(-1),tau), CSNumber.real(0), lam]),
	    List.turnIntoCSList([mu, CSNumber.mult(CSNumber.real(-1),lam), CSNumber.real(0)])]);


    var C = List.add(mat,M);
    
    // get nonzero index
    var ii = 0, jj = 0;
    max = 0;
    for(k = 0; k < 3; k++)
    for(l = 0; l < 3; l++){
    	if(CSNumber.abs(C.value[k].value[l]).value.real > max){
    		ii = k;
    		jj = l;
		max = CSNumber.abs(C.value[k].value[l]).value.real;
    	}
    }

    
    var lg = C.value[ii];
    C = List.transpose(C);
    var lh = C.value[jj];

    lg.usage = "Line";
    lh.usage = "Line";

    return [lg, lh];
};

geoOps.SelectConic =function(el){
    var set=csgeo.csnames[(el.args[0])];
    if(!el.inited){
        el.inited=true;
    }
    el.matrix=set.results[el.index-1];
    el.matrix=List.normalizeMax(el.matrix);
    el.matrix.usage="Conic";
};
geoOpMap.SelectConic="C";

// conic by 4 Points and 1 line
geoOps._helper.ConicBy4p1l =function(el,a,b,c,d,l){
    var a1 = List.cross(List.cross(a,c),l);
    var a2 = List.cross(List.cross(b,d),l);
    var b1 = List.cross(List.cross(a,b),l);
    var b2 = List.cross(List.cross(c,d),l);
    var o = List.realVector(csport.to(100*Math.random(),100*Math.random())); 

    var r1 = CSNumber.mult(List.det3(o,a2,b1),List.det3(o,a2,b2));
    r1 = CSNumber.sqrt(r1); 
    var r2 = CSNumber.mult(List.det3(o,a1,b1),List.det3(o,a1,b2));
    r2 = CSNumber.sqrt(r2); 

    var k1 = List.scalmult(r1,a1);
    var k2 = List.scalmult(r2,a2);

    var x = List.add(k1, k2);
    var y = List.sub(k1, k2);

    var t1 = geoOps._helper.ConicBy5(el,a,b,c,d,x);
    var t2 = geoOps._helper.ConicBy5(el,a,b,c,d,y);

    return [t1,t2];
};

geoOps.ConicBy4p1l =function(el){
    var a=csgeo.csnames[(el.args[0])].homog;
    var b=csgeo.csnames[(el.args[1])].homog;
    var c=csgeo.csnames[(el.args[2])].homog;
    var d=csgeo.csnames[(el.args[3])].homog;

    var l=csgeo.csnames[(el.args[4])].homog;

    var erg = geoOps._helper.ConicBy4p1l(el,a,b,c,d,l);

    el.results= erg;

};
geoOpMap.ConicBy4p1l="T";

geoOps.ConicBy1p4l =function(el){
    var l1=csgeo.csnames[(el.args[0])].homog;
    var l2=csgeo.csnames[(el.args[1])].homog;
    var l3=csgeo.csnames[(el.args[2])].homog;
    var l4=csgeo.csnames[(el.args[3])].homog;

    var p=csgeo.csnames[(el.args[4])].homog;

    var erg = geoOps._helper.ConicBy4p1l(el,l1,l2,l3,l4,p);
    var t1 = erg[0];
    var t2 = erg[1];
    t1 = List.adjoint3(t1);
    t2 = List.adjoint3(t2);
    
    erg = [t1,t2];
    el.results= erg;

};
geoOpMap.ConicBy1p4l="T";


geoOps.ConicBy5lines =function(el){
    var a=csgeo.csnames[(el.args[0])].homog;
    var b=csgeo.csnames[(el.args[1])].homog;
    var c=csgeo.csnames[(el.args[2])].homog;
    var d=csgeo.csnames[(el.args[3])].homog;
    var p=csgeo.csnames[(el.args[4])].homog;

    var erg_temp=geoOps._helper.ConicBy5(el,a,b,c,d,p);
    var erg = List.adjoint3(erg_temp);
    el.matrix=erg;
    el.matrix=List.normalizeMax(el.matrix);
    el.matrix.usage="Conic";
};
geoOpMap.ConicBy5lines="C";

geoOps.CircleBy3 =function(el){
    var a=csgeo.csnames[(el.args[0])].homog;
    var b=csgeo.csnames[(el.args[1])].homog;
    var c=List.ii;
    var d=List.jj;
    var p=csgeo.csnames[(el.args[2])].homog;
    var erg=geoOps._helper.ConicBy5(el,a,b,c,d,p);
    el.matrix=List.normalizeMax(erg);
    el.matrix.usage="Circle";

};
geoOpMap.CircleBy3="C";


geoOps._helper.tracing2=function(n1,n2,c1,c2,el){//Billigtracing
    var OK=0;
    var DECREASE_STEP=1;
    var INVALID=2;
    var tooClose=OK;
    var security = 3;

    var do1n1=List.projectiveDistMinScal(c1,n1);
    var do1n2=List.projectiveDistMinScal(c1,n2);
    var do2n1=List.projectiveDistMinScal(c2,n1);
    var do2n2=List.projectiveDistMinScal(c2,n2);

    
    if((do1n1 + do2n2)<(do1n2 + do2n1)){
        el.results=List.turnIntoCSList([n1,n2]);//Das ist "sort Output"
    } else {
        el.results=List.turnIntoCSList([n2,n1]);//Das ist "sort Output"

    }
    
};

geoOps._helper.tracing2X=function(n1,n2,c1,c2,el){
    var OK=0;
    var DECREASE_STEP=1;
    var INVALID=2;
    var tooClose=OK;
    var security = 3;

    var do1n1=List.projectiveDistMinScal(c1,n1);
    var do1n2=List.projectiveDistMinScal(c1,n2);
    var do2n1=List.projectiveDistMinScal(c2,n1);
    var do2n2=List.projectiveDistMinScal(c2,n2);
    var do1o2=List.projectiveDistMinScal(c1,c2);
    var dn1n2=List.projectiveDistMinScal(n1,n2);

    //Das Kommt jetzt eins zu eins aus Cindy
    
    var care = (do1o2 > 0.000001);
    
    // First we try to assign the points
    
    if (do1o2 / security > do1n1 + do2n2 && dn1n2 / security > do1n1 + do2n2) {
        el.results=List.turnIntoCSList([n1,n2]);//Das ist "sort Output"
        return OK + tooClose;
    }
    
    if (do1o2 / security > do1n2 + do2n1 && dn1n2 / security > do1n2 + do2n1) {
        el.results=List.turnIntoCSList([n2,n1]);//Das ist "sort Output"
        return OK + tooClose;
    }
    
    //  Maybe they are too close?
    
    if (dn1n2 < 0.00001) {
        // They are. Do we care?
        if (care) {
            tooClose = INVALID;
            el.results=List.turnIntoCSList([n1,n2]);
            return OK + tooClose;
        } else {
            el.results=List.turnIntoCSList([n1,n2]);
            return OK + tooClose;
        }
    }
    
    // They are far apart. We care now.
    if (!care || tooClose === INVALID) {
        el.results=List.turnIntoCSList([n1,n2]);//Das ist "sort Output"
        return OK + tooClose;
    }
    return DECREASE_STEP + tooClose;        
    
};

geoOps._helper.IntersectLC=function(l,c){

    var N=CSNumber;
    var l1=List.crossOperator(l);
    var l2=List.transpose(l1);
    var s=General.mult(l2,General.mult(c,l1));

    var ax=s.value[0].value[0];
    var ay=s.value[0].value[1];
    var az=s.value[0].value[2];
    var bx=s.value[1].value[0];
    var by=s.value[1].value[1];
    var bz=s.value[1].value[2];
    var cx=s.value[2].value[0];
    var cy=s.value[2].value[1];
    var cz=s.value[2].value[2];

    var xx=l.value[0];
    var yy=l.value[1];
    var zz=l.value[2];
    

    var absx=N.abs(xx).value.real;
    var absy=N.abs(yy).value.real;
    var absz=N.abs(zz).value.real;

    var alp;
    if(absz>=absx && absz>=absy){
        alp=N.div(N.sqrt(N.sub(N.mult(ay,bx),N.mult(ax,by))),zz);
    } 
    if(absx>=absy && absx>=absz){

        alp=N.div(N.sqrt(N.sub(N.mult(bz,cy),N.mult(by,cz))),xx);
    } 
    if(absy>=absx && absy>=absz){
        alp=N.div(N.sqrt(N.sub(N.mult(cx,az),N.mult(cz,ax))),yy);
    } 
    var erg=List.add(s,List.scalmult(alp,l1));
    var erg1=erg.value[0];
    erg1=List.normalizeMax(erg1);
    erg1.usage="Point";      
    erg=List.transpose(erg);
    var erg2=erg.value[0];
    erg2=List.normalizeMax(erg2);
    erg2.usage="Point";  
    return[erg1,erg2];

};

geoOps.IntersectLC =function(el){
    var l=csgeo.csnames[(el.args[0])].homog;
    var c=csgeo.csnames[(el.args[1])].matrix;
    
    var erg=geoOps._helper.IntersectLC(l,c);
    var erg1=erg[0];
    var erg2=erg[1];
                           
    if(!el.inited){
        el.check1=erg1;
        el.check2=erg2;
        el.inited=true;
        el.results=List.turnIntoCSList([erg1,erg2]);
        
    } else {
        var action=geoOps._helper.tracing2(erg1,erg2,el.check1,el.check2,el);
        if(!List._helper.isNaN(el.results.value[0]) &&!List._helper.isNaN(el.results.value[1])){
            el.check1=el.results.value[0];
            el.check2=el.results.value[1];
        }
    }
};
geoOpMap.IntersectLC="T";

geoOps.IntersectCirCir =function(el){
    var c1=csgeo.csnames[(el.args[0])].matrix;
    var c2=csgeo.csnames[(el.args[1])].matrix;

    var ct1 =c2.value[0].value[0];
    var line1=List.scalmult(ct1,c1.value[2]);
    var ct2 =c1.value[0].value[0];
    var line2=List.scalmult(ct2,c2.value[2]);
    var ll=List.sub(line1,line2);
    ll.value[2]=CSNumber.mult(CSNumber.real(0.5),ll.value[2]);
    ll=List.normalizeMax(ll);

    
    
    var erg=geoOps._helper.IntersectLC(ll,c1);
    var erg1=erg[0];
    var erg2=erg[1];
                           
    if(!el.inited){
        el.check1=erg1;
        el.check2=erg2;
        el.inited=true;
        el.results=List.turnIntoCSList([erg1,erg2]);
        
    } else {
        var action=geoOps._helper.tracing2(erg1,erg2,el.check1,el.check2,el);
        el.check1=el.results.value[0];
        el.check2=el.results.value[1];
    }

};
geoOpMap.IntersectCirCir="T";


geoOps.IntersectConicConic = function(el){
    var A=csgeo.csnames[(el.args[0])].matrix;
    var B=csgeo.csnames[(el.args[1])].matrix;

    console.log("A,B", A,B);

    var alpha = List.det(A);
    console.log("alpha",alpha);

    // indexing
    var one = CSNumber.real(1);
    var two = CSNumber.real(2);
    var three = CSNumber.real(3);

    // beta
//    var b1 = List.turnIntoCSList([List.column(A,one), List.column(A,two), List.column(B,three)]);
    var b1 = List.det3(List.column(A,one), List.column(A,two), List.column(B,three));
//    console.log("b11", b1);
    //b1 = List.add(b1, List.turnIntoCSList([List.column(A,one), List.column(B,two), List.column(A,three)]));
    b1 = CSNumber.add(b1, List.det3(List.column(A,one), List.column(B,two), List.column(A,three)));
 //   console.log("b12", b1);
    b1 = CSNumber.add(b1, List.det3(List.column(B,one), List.column(A,two), List.column(A,three)));
  //  console.log("b13", b1);
    var beta = b1;
    console.log("beta", beta);


    // gamma
    var g1 = List.det3(List.column(A,one), List.column(B,two), List.column(B,three));
    g1 = CSNumber.add(g1, List.det3(List.column(B,one), List.column(A,two), List.column(B,three)));
    g1 = CSNumber.add(g1, List.det3(List.column(B,one), List.column(B,two), List.column(A,three)));
    var gamma = g1;
    console.log("gamma", gamma);

    var delta = List.det(B);
    console.log("delta", delta);


    console.log("one",one);
    console.log(CSNumber.multiMult([one,two,three]));
    // calc L/M
    // powers
    var alpha2 = CSNumber.mult(alpha,alpha);
    var alpha3 = CSNumber.mult(alpha2, alpha);

    var beta2 = CSNumber.mult(beta,beta);
    var beta3 = CSNumber.mult(beta2, beta);

    var gamma2 = CSNumber.mult(gamma,gamma);
    var gamma3 = CSNumber.mult(gamma2, gamma);

    var delta2 = CSNumber.mult(delta,delta);
    var delta3 = CSNumber.mult(delta2, delta);

    // W = -2*beta^3 + 9*alpha*beta*gamma - 27*alpha^2*delta
    //
    // -2*beta^2 
    var W = CSNumber.mult(CSNumber.real(-2), beta3);
    // + 9*alpha*beta*gamma
    W = CSNumber.add(W, CSNumber.mult(CSNumber.mult(CSNumber.mult(alpha,beta),gamma),CSNumber.real(9)));
    // - 27*alpha^2*delta
    W = CSNumber.sub(W, CSNumber.mult(CSNumber.mult(CSNumber.real(27), alpha2), delta));


    // D
    // 
    //  - beta^2*gamma^2 + 4*alpha*gamma^3 + 4*beta^3*delta - 18*alpha*beta*gamma*delta + 27*alpha^2*delta^3
    //
    // - beta^2*gamma^2 
    var D = CSNumber.mult(CSNumber.real(-1), CSNumber.mult(beta2,gamma2));
    // + 4*alpha*gamma^3
    D = CSNumber.add(D, CSNumber.mult(CSNumber.mult(CSNumber.real(4), alpha), gamma3));
    // - 18*alpha*beta*gamma*delta 
    D = CSNumber.sub(D, CSNumber.multiMult([CSNumber.real(18), alpha, beta, gamma, delta]));
    // + 27*alpha^2*delta^3
    D = CSNumber.add(D, CSNumber.multiMult([CSNumber.real(27), alpha2, delta3]));
    console.log("D",D);

    // Q = W - alpha*sqrt(27*D)
    var Q = CSNumber.sub(W, CSNumber.mult(alpha, CSNumber.sqrt(CSNumber.mult(CSNumber.real(27),D))));
    console.log("Q",Q);

    // R = 3rd root of 4Q
    var R = CSNumber.pow2(CSNumber.mult(CSNumber.real(4), Q),1/3);
    console.log("R",R);


    // L
    var l1 = CSNumber.mult(CSNumber.real(2),beta2);
    l1 = CSNumber.sub(l1, CSNumber.multiMult([CSNumber.real(6), alpha, gamma]));
    var l2 = CSNumber.mult(CSNumber.real(-1),beta);
    var l3 = CSNumber.clone(R);

    var L = List.turnIntoCSList([l1, l2, l3]);

    // M
    var M = List.turnIntoCSList([R,CSNumber.real(1),CSNumber.real(2)]);
    M = List.scalmult(CSNumber.mult(CSNumber.real(3),alpha), M);
    console.log("M", M);

    var omega = CSNumber.complex(-0.5, Math.sqrt(0.75));
    var omega2 = CSNumber.mult(omega,omega);

    var Mat = List.turnIntoCSList([
        List.turnIntoCSList([omega, one, omega2]),
        List.turnIntoCSList([one, one, one]),
        List.turnIntoCSList([omega2, one, omega])]);


    // inverse of Mat
    // t1 = omega + omega^2 - 2
//    var t1 = CSNumber.sub(CSNumber.add(omega, omega2), CSNumber.real(-2));
 //   var omegat1 = CSNumber.mult(t1, omega);
//    var minusOne = CSNumber.real(-1);
//    var omegaPlusOne = CSNumber.add(omega, CSNumber.real(1));
//    var invMat = List.inverse(Mat);
//    console.log(invMat);
    //var lambda  = List.linearsolve(Mat, L);
//    var lambda = General.mult(invMat,L);
//    var mu      = General.mult(invMat, M);
      var lambda  = General.mult(Mat, L);
      var mu = General.mult(Mat,M);

    console.log("lambda", lambda);
    console.log("mu", mu); 

   for(var i = 0; i < 3; i++){
       console.log("lambda real", lambda.value[i].value.real)
       console.log("lambda imag", lambda.value[i].value.imag)
       console.log("mu real", mu.value[i].value.real)
       console.log("mu imag", mu.value[i].value.imag)
   }

    var C = List.scalmult(lambda.value[1], A);
    C = List.add(C, List.scalmult(mu.value[1], B));

//    console.log(C);
//    el.matrix=C;
//    el.matrix=List.normalizeMax(el.matrix);
//    el.matrix.usage="Conic";

//    erg.usage = "Conic";
 //   erg.matrix = C;
    var lines = geoOps._helper.splitDegenConic(C);
    console.log("lines",lines);


    var pts1 = geoOps._helper.IntersectLC(lines[0],A);
    var pts2 = geoOps._helper.IntersectLC(lines[1],A);
//
    console.log("pts");
    console.log(pts1);
    console.log(pts2);
//
//
   var check_sol = function(lam,muu){
       var tmp = CSNumber.multiMult([alpha,lam,lam,lam]);
       tmp = CSNumber.add(tmp, CSNumber.multiMult([beta,lam,lam,muu]));
       tmp = CSNumber.add(tmp, CSNumber.multiMult([gamma,lam,muu,muu]));
       tmp = CSNumber.add(tmp, CSNumber.multiMult([delta,muu,muu,muu]));
    console.log(tmp.value.real);
    console.log(tmp.value.imag);

   };

   console.log("check sol");
   for(var i = 0; i < 3; i++){
   check_sol(lambda.value[i],mu.value[i]);
   }

   el.inited=true;
   el.results=List.turnIntoCSList([pts1[0],pts1[1],pts2[0],pts2[1]]);






//    var ct1 =c2.value[0].value[0];
//    var line1=List.scalmult(ct1,c1.value[2]);
//    var ct2 =c1.value[0].value[0];
//    var line2=List.scalmult(ct2,c2.value[2]);
//    var ll=List.sub(line1,line2);
//    ll.value[2]=CSNumber.mult(CSNumber.real(0.5),ll.value[2]);
//    ll=List.normalizeMax(ll);
//
//    
//    
//    var erg=geoOps._helper.IntersectLC(ll,c1);
//    var erg1=erg[0];
//    var erg2=erg[1];
//                           
//    if(!el.inited){
//        el.check1=erg1;
//        el.check2=erg2;
//        el.inited=true;
//        el.results=List.turnIntoCSList([erg1,erg2]);
//        
//    } else {
//        var action=geoOps._helper.tracing2(erg1,erg2,el.check1,el.check2,el);
//        el.check1=el.results.value[0];
//        el.check2=el.results.value[1];
//    }

};
geoOpMap.IntersectConicConic="T";


geoOps.SelectP =function(el){
    var set=csgeo.csnames[(el.args[0])];
    if(!el.inited){
        el.inited=true;
    }
    el.homog=set.results.value[el.index-1];
};
geoOpMap.SelectP="P";



// Define a projective transformation given four points and their images
geoOps.TrProjection = function(el){
    function oneStep(offset){
        var tmp,
            a = csgeo.csnames[el.args[0+offset]].homog,
            b = csgeo.csnames[el.args[2+offset]].homog,
            c = csgeo.csnames[el.args[4+offset]].homog,
            d = csgeo.csnames[el.args[6+offset]].homog;
        // Note: this duplicates functionality from evaluator._helper.basismap
        tmp = List.adjoint3(List.turnIntoCSList([a,b,c]));
        tmp = List.productVM(d,tmp).value;
        tmp = List.transpose(List.turnIntoCSList([
            List.scalmult(tmp[0], a),
            List.scalmult(tmp[1], b),
            List.scalmult(tmp[2], c)]));
        return tmp;
    }
    var m = List.productMM(oneStep(1), List.adjoint3(oneStep(0)));
    m = List.normalizeMax(m);
    el.matrix = m;
};
geoOpMap.TrProjection="Tr";

// Apply a projective transformation to a point
geoOps.TransformP = function(el){
    var m=csgeo.csnames[(el.args[0])].matrix;
    var p=csgeo.csnames[(el.args[1])].homog;
    el.homog=List.normalizeMax(List.productMV(m, p));
    el.homog.usage="Point";      
};
geoOpMap.TransformP="P";    
