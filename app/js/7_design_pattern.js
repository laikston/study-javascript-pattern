/**
 * ########################################################################################################################
 * #1 싱글톤(Singletone)
 * 특정 클래스의 인스턴스를 오직 하나만 유지한다.
 * 동일한 클래스를 사용하여 새로운 객체를 생성하면, 두번째부터는 처음 만들어진 객체를 얻게된다.
 * 
 * js에서 객체들은 동일한 객체가 아니고서는 절대로 같을 수 없다
 * 완전히 같은 멤버를 가지는 똑같은 객체를 만들더라도 이전에 만들어진 객체와 동일하지느 ㄴ않다
 */

 var single = {
     myprop: 'my value'
 };
 var single2 = {
    myprop: 'my value'
};
console.log(single === single2, single == single2);

/**
 * 객체 리터럴을 이용해 객체를 만들 때마다 싱글톤을 만드는 것이고, 별도의 문법이 존재하지 않는다
 * 
 * new 사용하기
 * 동일한 생성자함수로 new를 사용하여 여러 개의 객체를 만들 경우, 실제로는 동일한 객체(생성자함수)에 대한 새로운 포인터만 반환하도록 구현하는 것이다.
 * 
 * uni는 생성자가 처음으로 호출되었을 때에만 생성된다. 
 * 두번째 이상 호출되었을 때는 동일한 uni객체가 반환된다. 
 * new로 생성된 객체들은 사실 동일한 객체를 가리키는 참조일 뿐이다.
 * 객체의 인스턴스인 this가 생성되면 Universe생성자가 이를 캐시한 후, 그 다음번에 생성자가 호출되었을 때 캐시된 인스턴스를 반환하게 하면 된다.
 * 
 */

 function Universe(){
     /**
      *  - 생성자의 스태틱 프로퍼티에 인스턴스를 저장한다. Universe.instance와 같은 프로퍼티에 인스턴스를 저장
      *    :
      */
     if(typeof Universe.instance === 'object'){ // 인스턴스가 이미 존재하는가
        return Universe.instance;
     }
     this.start_time = 0;
     this.bang = 'Big';
     Universe.instance = this; // instance를 캐시한다
     // return this; // 함축적인 반환
 }
 var uni = new Universe();
 var uni1 = new Universe();
 console.log(uni === uni1);

 /**
  *  - 클로저에 인스턴스 저장하기
  *    : 생성자를 재작성
  *      원본생성자가 최초로 호출되면 일반적인 방식대로 this를 반환한다. 두 번째 이상 호출되면 재작성된 생성자가 실해된다.
  *      재작성된 생성자는 클로저를 통해 비공개 instance 변수에 접근하여 이 인스턴스를 반환하기만 한다
  *      단점: 재정의 시점에 원본생성자에 추가된 프로퍼티를 잃어버린다는 점이다. Universe()의 프로토타입에 무언가를 추가해도 원본생성자로 생성된 인스턴스와 연결되지 않는다.
  */
 function Universe2(){
     var instance = this;
     this.start_time = 0;
     this.bang = 'Bing';

     Universe2 = function(){ // 생성자를 재작성
         return instance;
     }
 }
 Universe2.prototype.nothing = 'nothing'; // 프로토타입에 메소드 추가
 var uni2 = new Universe2();
 Universe2.prototype.everything = 'everything'; // 첫번째 객체가 만들어진 이후 다시 프로토타입에 메소드 추가한다
 var uni3 = new Universe2();
 console.log(uni2 === uni3);
 console.log(uni2.nothing); // 원래의 프로토타입만 객체에 연결된다.
 console.log(uni3.nothing); // 원래의 프로토타입만 객체에 연결된다.
 console.log(uni2.everything); // 나중의 프로토타입은 객체에 연결되지 않는다.
 console.log(uni3.everything); // 나중의 프로토타입은 객체에 연결되지 않는다.
 console.log(uni2.constructor.name);
 console.log(uni2.constructor === Universe2);
 /**
  * uni2.constructor 가 더이상 Universe2()생성자와 같지 않은 이유는 uni2.constructor가 재정의된 생성자가 아닌 원본 생성자를 가리키고 있기 때문이다.
  * 프로토타입의 생성자 포인터가 제대로 동작해야한다면 간단한 수정이 필요
  */

 function Universe3(){
     var instance; // 캐싱된 인스턴스
     Universe3 = function Universe3(){ // 생성자를 재작성한다.
        return instance;
    };
    Universe3.prototype = this; // 프로토타입 프로퍼티를 변경한다
    instance = new Universe3(); // instance
    instance.constructor = Universe3; // 생성자 포인터 재지정
    instance.start_time = 0;
    instance.bang = 'Big';
    return instance;
}
// prototype을 갱신하고 인스턴스를 만든다.
Universe3.prototype.nothing = 'Universe3 nothing'; // 프로토타입에 메소드 추가
var uni3_2 = new Universe3();
Universe3.prototype.everything = 'Universe3 everything'; // 첫번째 객체가 만들어진 이후 다시 프로토타입에 메소드 추가한다.
var uni3_3 = new Universe3();
console.log(uni3_2 === uni3_3); // 동일한 단일 인스턴스다.

// 모든 프로토타입 프로퍼티가 언제 선언되었는지 상관없이 동작한다.
console.log(uni3_2.nothing && uni3_2.everything && uni3_3.nothing && uni3_3.everything);

// 일반 프로퍼티도 동작한다
console.log(uni3_2.bang);
// constructor도 올바르게 가리킨다
console.log(uni3_2.constructor === Universe3);

/**
 * 생성자와 인스턴스를 즉시 실행 함수로 감싸는 방법.
 * 생성자가 최초로 호출되면 생성자는 객체를 생성하고 비공개 instance를 가리킨다.
 * 두번째 호출부터는 단순히 비공개 변수를 반환한다
 */

 var Universe4;
 (function(){
     var instance;
     Universe4= function Universe4(){
         if(instance){
             return instance;
         }
         instance = this;
         this.start_time = 0;
         this.bang = 'Big';
     };
 })();



 /**
 * ########################################################################################################################
 * #2 팩토리(Factory)
 * 목적은 객체들을 생성하는 것이다. 클래스 내부에서 또는 클래스의 스태틱 메서드로 구현
 *  - 비슷한 객체를 생성하는 반복작업수행
 *  - 팩토리 패턴의 사용자가 컴파일 타임에 구체적인 타입(클래스)를 모르고도 객체를 생성할 수 있게 해준다
 *      : 정적 클래스 언어에스 특히 중요, 컴파일 타임에 클래스에 대한 정보 없이 인스턴스를 생성하기 쉽지 않다.
 * 
 * 팩토리 메서드로 만들어진 객체들을 의도적으로 동일한 부모객체를 상속한다. (특화된 기능을 구현하는 구체적인 서브 클래스들.)    
 * 
 * 구현
 * CarMaker 생성자: 공통의 부모
 * CarMaker.factory(): car객체들을 생성하는 스태틱 메서드
 * CarMaker.Compact, CarMaker.SUV, CarMaker.Convertible: CarMaker를 상속하는 특화된 생성자, 이 모두는 부모의 스태틱 프로퍼티로 정의되어 전역 네임스페이스를 깨끗하게 유지하며, 필요할 때 쉽게 찾을 수 있다.
 * 
 */

 function CarMaker(){} // 부모생성자
 CarMaker.prototype.drive = function(){ // 부모의 메서드
     return 'Vroom, I have ' + this.doors + ' doors';
 };

 // 스태틱 factory 메서드
 CarMaker.factory = function(type){
     var constr = type, newcar;     
     if(typeof CarMaker[constr] !== 'function'){ // 생성자가 존재하지 않으면 에러던짐
        throw{
            name: 'Error',
            message: constr + "doesn't exist"
        };
     }

     // 생성자의 존재를 확인했으므로 부모를 상속, 상속은 단 한번만
     if(typeof CarMaker[constr].prototype.drive !== 'function'){
         CarMaker[constr].prototype = new CarMaker();
     }
     // 새로운 인스턴스를 생성
     newcar = new CarMaker[constr]();

     return newcar; // 인스턴스 반환
 }

 /**
  * 구체적인 자동차 메이커들을 선언
  */
 CarMaker.Compact = function(){
     this.doors = 4;
 }
 CarMaker.Convertible = function(){
     this.doors = 2;
 }
 CarMaker.SUV = function(){
     this.doors = 24;
 }

 /**
  * 팩토리 패턴에서 가장 특징적인 부분, 런타임시 문자열로 타입을 받아 해당타입의 객체를 생성, 반환한다.
  * 문자열로 식별되는 타입에 기반하여 객체들을 생성하는 함수
  */
 var corolla = CarMaker.factory('Compact'); 
 var solstice = CarMaker.factory('Convertible');
 var cherokee = CarMaker.factory('SUV');

 corolla.drive();
 solstice.drive();
 cherokee.drive();

 /**
  * 팩토리 패턴의 실전 예제 : 내장 전역 객체 Object()생성자
  * 입력값에 따라 다른 객체를 생성하기 때문에 팩토리처럼 동작된다. 숫자 원시 데이터타입을 전달하면 내부적으로 Number() 생성자로 객체를 만든다. 문자열, 불리언 마찬가지
  * 입력값이 없거나 어떤 다른 값을 전달하면 일반적인 객체를 생성
  */
 var oo = new Object(),
    on = new Object(1),
    os = Object('1'),
    ob = Object(true);

    console.log(oo.constructor === Object);
    console.log(on.constructor === Number);
    console.log(os.constructor === String);
    console.log(ob.constructor === Boolean);


/**
 * ########################################################################################################################
 * #3 반복자(Iterator)
 * 반복자 패턴에서 객체는 일종의 집합적인 데이터를 가진다. 데이터가 저장된 내부구조는 복잡하더라도 개별요소에 쉽게 접근할 방법이 필요할 것이다.
 * 객체의 사용자는 데이터가 어떻게 구조화되었는지 알 필요가 없고 개별요소르 원하는 작업을 할 수 있으면 된다
 * 반복자 패턴에서 객체는 next()메서드를 제공, 연이어 호출하면 반드시 다음 순서의 요소를 반환해야한다.
 * 단순히 루프 내에서 next()를 호출하여 개별 데이터 요소에 접근할 수 있다
 * 반복자 패턴에서 객체는 보통 hasNext()라는 편리한 메서드도 제공한다. 객체의 사용자는 이 메서드로 데이터의 마지막에 다다랐는지 확인할 수 있다
 * 반복자 패턴을 구현할 때 데이터는 물론 다음에 사용할 요소를 가리키는 포인터(인덱스)도 비공개로 저장해 두는 것이 좋다
 * 데이터에 좀 더 쉽게 접근하고 여러차례 반복회 순회할 수 있도록 다음과 같은 추가 메서드 제공한다
 *  - rewind(): 포인터를 다시 처음으로 되돌린다
 *  - current(): 현재의 요소를 반환한다. next()는 포인터를 전진시키기 때문에 이 작업을 할 수 없다.
 */
var agg = (function(){
    var index = 0,
        data = [1,2,3,4,5],
        length = data.length;
    return {
        next: function(){
            var element;
            if(!this.hasNext()){ // 반복자 패턴에서 객체는 보통 hasNext()라는 편리한 메서드도 제공한다. 객체의 사용자는 이 메서드로 데이터의 마지막에 다다랐는지 확인할 수 있다
                return null;
            }
            element = data[index];
            index = index + 2;
            return element;
        },
        hasNext: function(){
            return index < length;
        },
        rewind: function(){
            index = 0;
        },
        current: function(){
            return data[index];
        }
    }
})();
while(agg.hasNext()){
    console.log(agg.next());
}
agg.rewind();
console.log(agg.current());

/**
 * ########################################################################################################################
 * #4 장식자(Decorator))
 * 장식자 패턴을 이용하면 런타임시 부가적인 기능을 객체에 동적으로 추가할 수 있다.
 * 스태틱 클래스에서는 쉽지 않은 작업이지만, 객체를 변형할 수 있는 자바스크립트에서는 객체에 기능을 추가하는 절차에 아무런 문제가 없다
 * 장식자 패턴의 편리한 특징은 기대되는 행위를 사용자화하거나 설정할 수 있다.
 * 처음에는 기본적인 몇 가지 기능을 가지는 평번한 객체로 시작한다. 그런 후 사용가능한 장식자들의 풀에서 원하는 것을 골라 객체에 기능을 덧붙여간다
 * 순서지정도 가능하다
 * 
 * 어떤 물건을 파는 웹앱을 만들때
 * 각각 새로운 판매건은 새로운 sale객체가 된다
 * sale객체는 상품의 가격을 알고 있으며, sale.getPrice()메서드를 호출하면 이 가격을 반환한다.
 * 상황에 따라 추가기능으로 이 객체를 장식할 수 있다.
 * 캐나다의 퀘백지방에 있는 소비자에게 판매한다면 지방세를 지불히야 한다.
 * 장식자 패턴에 따르면 연방세 장식자와 퀘백 지방세 장식자로 객체를 '장식한다'고 말할 수 있다
 * 통화 형식을 지정하는 기능으로 장식할 수도 있다
 
 var sale = new Sale(100); // 가격은 100달러
 sale = sale.decorate('fedtax'); // 연방세를 추가한다
 sale = sale.decorate('quebec'); // 지방세를 추가한다
 sale = sale.decorate('money');  // 통화 형식을 지정한다
 console.log(sale.getPrice());

 var sale2 = new Sale(100); // 가격은 100달러
 sale2 = sele2.decorate('fedtax'); // 연방세를 추가한다
 sale2 = sale2.decorate('cdn'); // cdn을 사용해 형식을 지정한다
 console.log(sale2.getPrice());

  * 예제에서처럼 장식자 패턴은 런타임시에 기능을 추가하고 객체를 변경하는 유연한 방법이다
  * 
  * 장식자 패턴을 구현하기 위한 한 가지 방법은 모든 장식자 객체에 특정 메서드를 포함시킨 후, 이 메서드를 덮어쓰게 만드는 것
  * 각 장식자는 이전의 장식자로 기능이 추가된 객체를 상속한다
  * 장식 기능을 담당하는 메서드들은 uber(상속된 객체)에 있는 동일한 메서드를 호출하여 값을 가져온 다음 다음 추가 작업을 덧붙이는 방식으로 진행한다
  * 결과적으로 getPrice를 호출하게 되면 money장식자의 동일한 메서드를 호출한 셈이다.
  * 그러나 각각의 꾸며진 메서드는 우선 부모의 메서드를 호출하기 때문에 money의 getPrice는 벼듇ㅊdml getPrice를 우선 호출하고 여기서 다시 fedtax의 getPrice를 호출하는 방식으로
  * 차례대로 거슬러 올라가게 된다.
  * 이러한 연쇄호출은 장식이 더해지지 않은 Sale 생성자에 구현된 원본 getPrice를 찾아낼 때까지 이어진다.
  * 
  * ::: pattern 1
  */

  function Sale(price){
      this.price = price || 100;
  }
  Sale.prototype.getPrice = function(){
      return this.price;
  }
  /**
   * 임시생성자 패턴
   * 자식객체가 보무 객체에 접근할 수 있도록 newobj에 uber 프로퍼티도 지정해 준다
   * 모든 장식자들의 추가 프로퍼티들을 새로 꾸며진 newobj객체로 복사한다
   * newobj가 새롭게 갱신된 sale객체다
   * 
   */
  Sale.prototype.decorate = function(decorator){
      var F = function(){},
        overrides = this.constructor.decorators[decorator],
        i, newobj;
    F.prototype = this;
    newobj = new F();
    newobj.uber = F.prototype;
    for(i in overrides){
        if(overrides.hasOwnProperty[i]){
            newobj[i] = overrides[i];
        }
    }
    return newobj;
  }
  Sale.decorators = {}; // 장식자 객체들은 생성자 프로퍼티의 프로퍼티로 구현
  Sale.decorators.fedtax = { // 부모의 메서드로부터 값을 가져온 다음 그 값을 변경한다
    getPrice: function(){
        var price = this.uber.getPrice();
        price += price * 5 / 100;
        return price;
    }   
  }
  Sale.decorators.quebec = {
      getPrice: function(){
          var price = this.uber.getPrice();
          price += price * 7.5 / 100;
          return price;
      }
  }
  Sale.decorators.money = {
      getPrice: function(){
          var price = this.uber.getPrice();
          return '$' + price.toFixed(2);
      }
  }
  Sale.decorators.cdn = {
      getPrice: function(){
        var price = this.uber.getPrice();
        return 'CDN$' + price.toFixed(2);
      }
  }

  var sale = new Sale(100); // 가격은 100달러
  sale = sale.decorate('fedtax'); // 연방세를 추가한다
  sale = sale.decorate('quebec'); // 지방세를 추가한다
  sale = sale.decorate('money');  // 통화 형식을 지정한다
  console.log(sale.getPrice());
  
  var sale2 = new Sale(100); // 가격은 100달러
  sale2 = sale2.decorate('fedtax'); // 연방세를 추가한다
  sale2 = sale2.decorate('cdn'); // cdn을 사용해 형식을 지정한다
  console.log(sale2.getPrice());

  /**
   * ::: pattern 2
   * 동적특성을 최대한 활용하며 상속은 전혀 사용하지 않는다.
   * 각각의 꾸며진 메서드가 체인 안에 있는 이전의 메서드를 호출하는 대신에 간단하게 이전 메서드의 결과를 다음 메서드의 매개변수로 전달한다.
   * 이 구현방법은 장식을 취소하거나 제거하기 쉽다
   * decorate()에서 반환되 ㄴ값을 다시 객체에 할당하지 않기 때문에 사용방법이 조금 더 간단하다.
   */
   function Sale22(price){
       this.price = (price > 0) || 100;
       this.decorators_list = [];
   }
   Sale22.decorator = {};
   Sale22.decorator.fedtax = {
       getPrice: function(price){
           return price + price * 5 /100;
       }
   }
   Sale22.decorator.quebec = {
       getPrice: function(price){
           return price + price * 7.5 /100;
        }
    }
    Sale22.decorator.money = {
        getPrice: function(price){
            return '$' + price.toFixed(2);
        }
    }
    Sale22.prototype.decorate = function(decorator){ // 단지 장식자를 추가함
        this.decorators_list.push(decorator);
    }
    Sale22.prototype.getPrice = function(){ // 현재 추가된 장식자들의 목록을 조사하고, 각각의 getPrice메서드를 호출하면서 이전 반환값을 전달한다.
        var price = this.price,
            i, max = this.decorators_list.length,
            name;
            for(i = 0; i < max; i++){
                name = this.decorators_list[i];
                price = Sale22.decorator[name].getPrice(price);
            }
            return price;
    }

    var sale22 = new Sale22(100);
    sale22.decorate('fedtax'); // 연방세를 추가한다
    sale22.decorate('quebec'); // 지방세를 추가한다
    sale22.decorate('money');  // 통화 형식을 지정한다
    console.log(sale22.getPrice());

    /**
     * getPrice가 장식되기를 허용한 유일한 메서드
     * 더 많은 메서드를 장식하고 싶다면 추가되는 메서드에도 모두 장식자 목록을 순회하는 부분이 반복해서 들어가야 한다.
     * 이런 작업은 메서드를 인자로 받아 '장식가능'하게 만들어주는 도우미 메서드로 쉽게 분리해낼 수 있다.
     * 이러기 위해서는 decorators_list프로퍼티를 객체로 변경하여 메서드 이름을 키로 하고 해당 메서드의 장식자 객체들의 배열을 값으로 가지도록 해야 할 것이다.
     */

     /**
     * ########################################################################################################################
     * #5 전략
     * 런타임에 알고리즘을 선택할 수 있게 해준다
     * 사용자는 동일한 인터페이스를 유지하면서 특정한 작업을 처리할 알고리즘을 여러가지중에서 상황에 맞게 선택할 수 있다
     * 전략패턴을 사용하는 사용하는 예제로 폼 유효성 검사를 드 ㄹ수 있다
     * validate()메서드를 가지는 validator 객체를 만든다
     * 이 메서드는 폼의 특정한 타입에 관계없이 호출되고, 항상 동일한 결과, 즉 유효성 검사를 통과하지 못한 데이터 목록과 함께 에러메세지를 반환한다
     * 그러나 사용자느 ㄴ구체적인 폼과 검사할 데이터에 따라서 다른 종류의 검사바업을 선택할 수도 있다
     * 유효성 검사기가 작업을 처리할 최선의 전략을 선택하고 그에 해당하는 적절한 알고리즘에 실질적인 데이터 검증 작업을 위임한다.
     * 
     */

     var data = {
         first_name: 'Super',
         last_name: 'Man',
         age: 'unknown',
         username: '0_o'
     };

     /**
      * 이 구체적인 예제에서 유효성 검사기가 사용할 최선의 전략을 알아내기 위해서 설정을 통해 어떤 데이터를 유효한 데이터로 받아들일지 규칙을 지정한다
      * 이름은 상관없고 성은 필수값이 아님.나이는 숫자, 사용자명은 특수문자를 제외한 글자와 숫자이다
      */
     
      var validator = {
          type: {}, // 사용할 수 있는 모든 검사 방법들
          messages: [], // 현재 유효성 검사 세션의 에러 메세지들
          config: {}, // 현재 유효성 검사 설정, '데이터 필드명: 사용할 검사 방법' 의 형식
          validate: function(data){ // 인터페이스 메서드, data는 이름 => 쌍이다
            var i, msg, type, checker, result_ok;
            this.messages = []; // 모든 메세지를 초기화한다
            for(i in data){
                if(data.hasOwnProperty(i)){
                    type = this.config[i];
                    checker = this.type[type];
                    if(!type){
                        continue; // 설정되 ㄴ검사방법이 없을 경우 검증할 필요가 없으므로 건너뛴다
                    }
                    if(!checker){ // 설정이 존재하나 해당하는 검사방법을 찾을 수 없을 경우 오류던짐
                        throw{
                            name: 'Validation Error',
                            message: type + ' 존재하지 않흡' 
                        };
                    }
                    result_ok = checker.validate(data[i]);
                    if(!result_ok){
                        msg = checker.instructions;
                    }
                }
            }
            return this.hasError();

          },
          hasError: function(){
              return this.messages.length !== 0;
          }
      };

      validator.type.isNonEmpty = { // 값을 가지는지 확인
          validate: function(value){
              return value !== "";
          },
          instructions: '이 값을 필수'
      };
      validator.type.isNumber = { // 숫자값인지 확인
          validate: function(value){
              return !isNam(value);
          },
          instructions: '이 값은 숫자여만 함'
      };
      validator.type.isAlphaNum = {
          validate: function(value){
              return !/[^a-z0-9]/i.tetxt(value);
          },
          instructions: '이 값은 특수문자를 제외한 문자만 사용가능'
      }

     validator.validate(data);
     if(validator.hasError()){
         console.log(validator.messages.join("\n"));
     }
