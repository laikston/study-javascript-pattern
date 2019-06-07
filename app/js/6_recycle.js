/**
 * 
 * 클래스 방식의 상속을 사용할 경우 예상되는 산출물
 * 클래스 방식의 상속을 구현할 때의 목표는 Child()라는 생성자 함수로 생성된 객체들이 다른 생성자 함수인 Parent()의 프로퍼티를 가지도록 하는 것이다.
 * 
 */
function Parent_1(name){ // 부모생성자
    this.name = name || 'Adam';
}
Parent_1.prototype.say = function(){ // 생성자의 프로토타입에 기능을 추가한다
    return this.name;
}
function Child_1(name){} // 아무 내용이 없는 자식생성자
inherit_1(Child_1, Parent_1); // 상속
/**
 * 부모 생성자와 자식생성자가 있고 부모 생성자의 프로토타입에 say()라는 메서드를 추가, 그리고 상속을 처리하는 inherit()함수 호출,
 */
function inherit_1(_c, _p){
    _c.prototype = new _p();
}
/*********************************************************************************************************************************************************************
 * 클래스 방식의 상속패턴 
 * #1 기본패턴
 * 
 * 가장 널리 쓰이는 기본적인 방법은 Parent()생성자를 사용해 객체를 생성한 다음, 이 객체를 Child()의 프로토타입에 할당.
 * prototype 프로퍼티가 함수가 아닌 객체를 가리키게 하는 것(프로토타입이 부모 생성자 함수 자체가 아니라 부모 생성자 함수로 생성한 객체 인스턴스를 가리켜야 한다.)
 * 이 후 new Child()를 사용해 객체를 생성하면 프로토타입을 통해 Parent()인스턴스의 기능을 물려받게 된다
 */
var kid_1 = new Child_1();
kid_1.say();
/**
 * #1 기본패턴 프로토타입 체인 추적
 * 부모객체의 프로토타입에 추가된 프로퍼티, 메서드들과 함꼐 부모 객체 자신의 프로퍼티도 모두 물려받음
 *
 * #1 기본패턴 의 동작원리
 * new Parent()를 사용해 객체 생성(Parent의 인스턴스에는 name이라는 프로퍼티를 갖고 있음) -> say()에 접근하기 위해서는 prototype을 통해서 접근 가능
 * 
 *  + new Parent()
 *    name = Adam
 *    __proto__ ----------> + Parent.prototype
 *                            say()
 * 
 * var kid = new Child();로 새로운 객체를 생성하면
 * 
 *  + new Child()
 *    __proto__ ------------> + new Parent()
 *                              name = Adam
 *                              __proto__ ----------------> + Parent.prototype
 *                                                            say()
 * 
 * Child 생성자는 비어있고(프로퍼티가 없다), Child.prototype도 비어있다.
 * Child의 __proto__는 new Parent()를 가리킨다.
 * kid.say()를 실행하면 Parent.prototype에 있는 say()가 실행되고, return 되는 name도 Parent에 있는 this.name을 들고 온다. (총 2번 탐색)
 * 하지만 Child에 name프로퍼티가 있으면 say()는 Parent.prototype에서 부르지만 name은 Child에 있는 프로퍼티를 사용할 것이다.
 * 
 * var kid = new Child();
 * kid.name = 'Patrick';
 * kid.say(); // 'Patrick'
 * 
 * kid.name을 지정하면 Parent의 name값이 변경되는 것이 아니라 Child의 name프로퍼티가 생성된다
 * 
 * #1 기본패턴 단점
 * 1-부모 객체의 this에 추가된 객체 자신의 프로퍼티와 프로토타입 프로퍼티 모두를 물려받음.
 * 대부분의 경우 객체 자신의 프로퍼티는 특정 인스턴스에 한정되어 재사용 할 수 없기 때문에 필요 없음
 * 2-자식생성자에 인자를 넘겨도 부모 생성자에 전달하지 못한다.
 * var s = new Child('Eve');
 * s.say(); // 'Eve'
 * 자식객체가 부모 생성자에 인자를 전달하는 방법도 있겠지만 이 방법은 자식 인스턴스를 생성할 때마다 상속을 실행해야 하기 때문에 결국 부모객체를 계속 재생성하는 셈이라 비효율적
 * 
 */


 /*********************************************************************************************************************************************************************
  * #2 생성자 빌려쓰기
  * #1의 단점(자식에서 부모로 인자를 전달하지 못함)을 해결, 부모 생성자 함수의 this에 자식객체를 바인딩한 후 자식 생성자가 받은 인자들을 모두 넘겨줌
  * 
  * function Child(a,c,d,b){
  *     Parent.apply(this, arguments);
  * }
  * 
  * 부모생성자 함수 내부의 this에 추가된 프로퍼티만 물려받게 됨. 프로토타입에 추가된 멤버는 상속되지 않는다.
  * 자식객체는 상속된 멤버의 복사본을 받게되며, #1에서의 자식객체가 상속된 멤버의 참조를 물려받는 것과는 다르다.
  * 
  */

  function Article(){
      this.tags = ['js', 'css'];
  }
  var article = new Article(); // Article의 인스턴스
  function BlogPost(){} // 클래스 방식의 패턴 #1을 사용해 article 객체를 상속하는 blog 객체를 생성한다
  BlogPost.prototype = article; // new Article과 연결되며 Article의 __proto__를 타고 Article의 prototype 메서드에 접근 가능
  var blog = new BlogPost(); // 이미 인스턴스가 존재하기 때문에 'new Article()'을 쓰지 않았다.
  function StaticPage(){
      Article.call(this);
  }
  var page = new StaticPage();

  /**
   *  + new Article()
   *    tags                                                         + new BlogPost()
   *    __proto__ ------------> BlogPost.prototype <----------------   __proto__
   */

  console.log(article.hasOwnProperty('tags')); 
  console.log(blog.hasOwnProperty('tags'));
  console.log(page.hasOwnProperty('tags'));
  /**
   * 기본패턴을 적용한 blog객체는 tags를 자기자신의 프로퍼티로 가진 것이 아니라 프로토타입을 통해 접근한다
   * 생성자만 빌려쓰는 방식으로 상속받은 page객체는 부모의 tags멤버에 대한 참조를 얻는 것이 아니라 복사본을 얻게 되므로 자기자신이 tags 프로퍼티를 갖게됨
   */
  blog.tags.push('html'); // tags 프로퍼티를 갖지 않는다. 부모 Article이 갖고 있기 때문에 Article의 tags가 변화된다.
  page.tags.push('php'); // article의 복사본 tags를 갖는다. article의 tags와는 다른 프로퍼티.
  console.log(article.tags.join(', '));
 
  function Parent_2(name){ // 부모 생성자
      this.name = name || 'Adam';
  }
  Parent_2.prototype.say = function(){ // 부모 생성자 프로토타입 메서드 추가
      return this.name;
  }
  function Child_2(name){ // 자식 생성자
      Parent_2.apply(this, arguments);
  }
  var kid_2 = new Child_2('Patrick');
  kid_2.name;
  typeof kid_2.say;

  /**
   * + new Parent('Adam')
   *   name = Adam
   *   __proto__ -------------> + Parent.prototype
   *                             say()
   * 
   * + new Child('Patrick')
   *   name = Patrick
   *   __proto__ --------------> + Child.prototype
   * 
   * 새로 생성된 Child객체와 Parent사이에 링크가 존재하지 않는다.
   * kid는 자기자신의 name프로퍼티를 가지지만 say()메서드는 상속받을 수 없다.
   * 
   * 생성자를 하나 이상 빌려쓰는 다중 상속 구현 가능
   * 
   */
  function Cat(){
      this.legs = 4;
      this.say = function(){
          return 'meaowww';
      }
  }
  function Bird(){
      this.wings = 2;
      this.fly = true;
  }
  function CatWings(){
      Cat.apply(this);
      Bird.apply(this);
  }
  var jane = new CatWings();
  console.log(jane);
  /**
   * #2 단점 및 장점
   * 프로토타입이 전혀 상속되지 않음
   * 반면 부모생성자 자신의 멤버에 대한 복사본을 가져올 수 있으므로 자식이 실수로 부모의 프로퍼티를 덮어쓸 수 없다
   */

  /*********************************************************************************************************************************************************************
   * #3 생성자 빌려쓰고 프로토타입 지정
   * 
   */
function Parent_3(name){ // 부모 생성자
    this.name = name || 'Adam';
}
Parent_3.prototype.say = function(){ // 부모 생성자 프로토타입 메서드 추가
    return this.name;
}
function Child_3(name){
    Parent_3.apply(this, arguments);
}
Child_3.prototype = new Parent_3();
/**
 * #3 장점 및 단점
 * 부모가 가진 자신의 프로퍼티 복사본을 가지고, 부모의 프로토타입 멤버들을 사용할 수 있는 포인터 받음.
 * 자식이 부모생성자에 인자를 넘길 수 있음. 
 * 즉, 부모가 가진 모든 것을 상속, 자신만의 프로퍼티를 부모의 프로퍼티와 별개로 변경 가능.
 * 부모 생성자 두번호출하는 셈이므로 비효율적임
 */
var kid_3 = new Child_3('Patrick');
kid_3.name;
kid_3.say();
delete kid_3.name;
kid_3.say();
/**
 * 자신의 프로퍼티(name)이 삭제되면 프로토타입 체인을 통해서 부모의 동일이름 프로퍼티에 접근 가능하다
 * 
 *                                + new Child('Patrick')
 *                                  name = Patrick
 * + new Parent() -------------->   __proto__
 *   name = Adam
 *   __proto__ ------------>  + Parent.prototype
 *                              say()
 */

 /*********************************************************************************************************************************************************************
   * #4 프로토타입 공유
   * 부모생성자를 호출하지 않음.
   * 원칙적으로 재사용할 멤버는 this가 아닌 prototype에 추가되어야 한다. 따라서 상속되어야 하는 모든 것들도 prototype에 존재하여야 함.
   * 부모의 프로토타입을 똑같이 자식의 프로토타입으로 저장한다
   * 모든 객체가 실제로 동일한 프로토타입을 공유하게 되므로 프로토타입 체인 검색이 간단, 짧아짐
   * 
   * #4 단점
   * 상속체인의 하단 어딘가 있는 자식이나 손자가 프로토타입을 수정할 경우, 모든 부모와 손자뻘의 객체에 영향을 미치기 때문
   * 부모와 자식객체가 모두 동일한 프로토타입을 공유하며 say()메서드도 똑같은 접근 권한을 가진다. 그러나 자식객체는 name프로퍼티를 물려받지 않는다.
   * 
   * + new Parent()
   *   name = Adam                                           + new Child()
   *   __proto__ -----------> + Parent.prototype ---------->   __proto__
   *                            say()
   */
function Parent_4(name){
    this.name = name || 'Adam';
}
Parent_4.prototype.say = function(){
    return this.name;
}
function Child_4(name){}
inherit_4(Child_4, Parent_4);
function inherit_4(_c, _p){
    _c.prototype = _p.prototype;
}
/*********************************************************************************************************************************************************************
   * #5 임시생성자
   * 프로토타입 체인의 이점은 유지하면서 동일한 프로토타입을 공유할 때의 문제를 해결(부모와 자식의 프로토타입 사이에 직접적인 링크를 끊는다)
   * 빈함수 F()가 부모와 자식 사이에서 프록시 기능을 맡음
   * 
   * + new Parent()                                                                                                                                 + new Child()
   *   name = Adam                                                                      + new F()   -------------> + Child.prototype ------------->   __proto__
   *   __proto__ -----------> + Parent.prototype <---------- + F.prototype ----------->   __proto__ 
   *                            say()
   * 
   * 자식이 프로토타입의 프로퍼티만을 물려받음
   * 부모생성자에서 this에 추가한 멤버는 상속되지 않는다
   */
function Parent_5(name){
    this.name = name || 'Adam';
}
Parent_5.prototype.say = function(){
    return this.name;
}
function Child_5(name){}

/**
 * 프록시 생성자 활용 패턴 :: 임시생성자가 결국은 부모의 프로토타입을 가져오는 프록시로 사용
 * 임시생성자는 한번만 만둘어두고 임시 생성자의 프로토타입만 변경, 즉시 실행함수를 활용하여 프록시 함수를 클로저 안에 저장
 */
var inherit_5 = (function(_c, _p){
    var _f = function(){};
    return function(_c, _p){
        _f.prototype = _p.prototype;
        _c.prototype = new _f();
        _c.uber = _p.prototype; // 상위클래스 저장. 부모 원본에 대한 참조 추가
        /**
         * 생성자 함수를 가리키는 포인터를 재설정
         * 생성자 포인터를 재설정하지 않으면 모든 자식객체들의 생성자는 Parent()로 지정돼 있을 것, 유용성 떨어짐
         */
        _c.prototype.constructor = _c;
    }
})();
var kid_5 = new Child_5();
inherit_5(Child_5, Parent_5);
/**
 * kid_5.name은 undefined // name은 부모 자신의 프로퍼티인데 상속과정에서 new Parent()를 호출한 적이 없음. 
 * kid_5.say() // say()는 f함수의 prototype 체인을 통해서 찾을 수 있다.
 */
kid_5.constructor.name; // 생성자 포인터를 재설정 후
console.log(kid_5.constructor === Parent_5); // 생성자 포인터를 재설정 후
/**
 * constructor 프로퍼티는 런타임 객체 판별에 유용, 
 */


 /**
  * Klass 모방
  */
 var klass = function(Parent, props){
    var Child, F, i;

    /**
     * 새로운 생성자
     * Child() 생성자 함수가 생성된다. 마지막에 이 함수가 반환대어 클래스로 사용될 것이다
     * __construct 메서드가 있다면 이 함수 안에서 호출된다. 
     * 그 전에 부모의 __construct가 있다면 uber 스태틱 프로퍼티를 사용하여 호출한다
     * Man 클래스처럼 별도의 부모클래스 없이 Object를 상속했다면 uver라는 프로퍼티는 정의되어있지 않을 수 있다
     */
    Child = function(){
        if(Child.uber && Child.uber.hasOwnProperty("__construct")){
            Child.uber.__construct.apply(this, arguments);
        }
        if(Child.prototype.hasOwnProperty("__construct")){
            Child.prototype.__construct.apply(this, arguments);
        }
    };

    /**
     * 상속
     * 상속을 처리한다
     * 바로 앞절에서 다룬 클래식 방식의 최종버젼
     * 유일하게 새로운 점은 상속받을 클래스에 Parent 가 존재하지 않을 경우 Object가 지정되도록
     */
    Parent = Parent || Object;
    F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;    

    /**
     * 루프를 돌면서 클래스를 실제로 정의하는 구현 메서드를 Child 프로토타입에 추가
     */
    for(i in props){
        if(props.hasOwnProperty(i)){
            Child.prototype[i] = props[i];
        }
    }
    return Child;
}

var Man = klass(null, {
    __construct: function(what){
        console.log('Mans constructor');
        this.name = what;
    },
    getName: function(){
        return this.name;
    }
});

var SuperMan = klass(Man, {
    __construct: function(what){
        console.log('Supermans constructor');
    },
    getName: function(){
        var name = SuperMan.uber.getName.call(this);
        return "I am " + name;
    }
});

/**
 * 프로토타입을 활용한 상속
 * 객체가 객체를 상속받는다. 재사용하려는 객체가 하나 있고 또 다른 객체를 만들어 이 첫번째 객체의 기능을 가져온다
 */

 function Person_1(){
     this.name = 'Adam';
 }
 Person_1.prototype.getName = function(){
     return this.name;
 }
 var papa = new Person_1();
 function object(o){
     function F(){}
     F.prototype = o;
     return new F();
 }
 /**
  * 임시 생성자 함수 F()를 사용, F()의 프로토타입에 parent 객체를 지정한다.임시생성자의 새로운 인스턴스 반환
  * 
  *                               + child = new F(); 
  * + parent      -------------->   __proto__
  *   name = papa
  * 
  * 부모 객체 자신의 프로퍼티와 생성자 함수의 프로토타입에 포함된 프로퍼티가 모두 상속됨
  */
 var child_6 = object(papa);
 var child_6 = object(Person_1.prototype);
 child_6.getName();


 /**
  * 프로퍼티 복사를 통한 상속패턴
  * 
  * 부모의 멤버들에 대해 류프를 돌면서 자식에 복사한다.
  * 이러한 구현을 얕은 복사라고도 한다. 반대로 깊은 복사란 복사하려는 프로퍼티가 객체나 배열인지 확인해보고
  * 객체 또는 배열이면 중첩된 프로퍼티까지 재귀적으로 순회하여 복사하는 것을 말한다.
  * js에서는 객체는 참조만 전달되기 때문에 얕은 복사 후에 자식쪽에서 객체타입인 프로퍼티값을 수정하면
  * 부모의 프로퍼티도 수정되어 버린다.
  * 
  */
 function extend(parent, child){
    var i;
    child = child || {};
    for(i in parent){
        if(parent.hasOwnProperty(i)){
            child[i] = parent[i];
        }
    }
    return child;
 }
 var dad = {
    name: 'Adam'
 };
 var kid = extend(dad);
 kid.name;

 /**
  * 깊은 복사
  */
 function extendDeep(parent, child){
    var i,
        toStr = Object.prototype.toString,
        astr = '[object Array]';
    
        child = child || {};

        for(i in parent){
            if(parent.hasOwnProperty(i)){
                if(typeof parent[i] === 'object'){
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {} ;
                    extendDeep(parent[i], child[i]);
                }else{
                    child[i] = pareng[i]
                }
            }
        }
        return child;
 }

 /**
  * 믹스인
  * 하나의 객체를 복사하는 게 아니라 여러 객체에서 복사해온 것을 한 객체 안에 섞어 넣을 수도 있다
  */
 function mix(){
     var arg, prop, child = {};
     for(arg = 0; arg < arguments.length; arg += 1){
         for(prop in arguments[arg]){
             if(arguments[arg].hasOwnProperty(prop)){
                 child[prop] = arguments[arg][prop];
             }
         }
     }
     return child;
 }
 var cake = mix(
     {egg: 2, large: true},
     {bitter: 1, salted: true},
     {flour: '3 cups'},
     {suger: true}
 )

/**
 * 메서드 빌려쓰기
 * 쓸일이 없는 모든 메서드를 상속받지 않고 원하는 메서드만 골라서 사용
 */


  