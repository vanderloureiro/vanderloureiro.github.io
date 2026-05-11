---
title: Programação funcional com Scala e ZIO
description: Apresentação de programação funcional com a linguagem Scala e com a biblioteca ZIO, trazendo conceitos iniciais de efeitos funcionais, mônadas e encadeamento de efeitos com flatMap
published-at: 11-05-2026
---
## Programação funcional com Scala e ZIO
<br>

A linguagem Scala tem a versatilidade de trazer elementos de orientação a objetos e programação funcional em sua sintaxe que roda na JVM. Nesse texto vamos focar na perspectiva funcional usando a biblioteca ZIO.

ZIO é uma biblioteca de programação funcional com foco em concorrência que traz na sua abordagem um estilo de programação declarativa e imutável para construir aplicações resilientes, escaláveis e *event-driven*.

### Tipo ZIO

Primeiro é necessário entender a ideia do tipo de dado ZIO, que é chamado de *functional effect type* (tipo de efeito funcional). O tipo **ZIO[R, E, A]** é o modelo de dado fundamental da biblioteca e os valores desse tipo são chamados de *functional effects* (efeitos funcionais).

Esse é um modelo puramente descritivo e precisa ser executado para observar qualquer side-effect, como logging, interação com banco de dados, streams de dados, requests, etc.

![Descrição de tipo ZIO](/assets/images/posts/programacao-funcional-com-scala-e-zio/tipo-zio.png)

**R** é o ambiente necessário para que o efeito seja executado. Isso pode incluir quaisquer dependências que o efeito tenha, por exemplo, acesso a um banco de dados; ou um efeito pode não requerer nenhum ambiente, caso em que o tipo do parâmetro será `Any`.

**E** é o tipo de valor com o qual o efeito pode falhar. Pode ser `Throwable` ou `Exception`, mas também pode ser um tipo de erro específico do domínio; ou um efeito pode nem mesmo ser capaz de falhar, caso em que o tipo do parâmetro será `Nothing`.

**A** é o tipo de valor com o qual o efeito pode ser executado com sucesso. Pode ser considerado como o valor de retorno ou a saída do efeito.

Abaixo temos um exemplo de um objeto ZIO e seus respectivos parâmetros:

```
val myLog: ZIO[Any, Nothing, Unit] = ZIO.succeed(println("Hello, Scala!"))
```

O atributo `myLog` declara um efeito gerado através do construtor `ZIO.succeed()` que roda em qualquer ambiente (R: Any), não lança nenhum erro (E: Nothing) e não retorna valor algum ao final (A: Unit) pois o ZIO apenas imprime uma mensagem no console.

Para quem vem do Java, podemos usar como comparação o tipo `Optional<T>`. O `Optional`, assim como o tipo ZIO, é uma mônada. Uma mônada na programação funcional é uma estrutura que representa computações em um contexto e fornece mecanismos padronizados para compor essas computações. Essa estrutura pode evitar erros como `NullPointerExeception`, por exemplo.

### Procedural vs descritivo

Um ponto crucial é entender que escrevemos efeitos de forma declarativa, algo diferente da programação procedural que estamos acostumados. Se temos um código como o descrito abaixo, ele será executado de forma sequencial assim que o programa é iniciado:

```
println("Hello, Scala")
```

Já com ZIO, nós apenas declaramos um efeito que não é executado. Executamos apenas em um segundo momento quando quisermos.

```
import zio._

val printLog = ZIO.succeed(println("Hello"))
```

Por mais que por esse exemplo acima não haja grande diferença, o principal objetivo aqui é separar o que queremos fazer de como queremos fazer. Temos um efeito `printLog` que define o que eu quero fazer, que no caso é logar uma mensagem. O efeito que eu quero que seja feito pode ser chamado a qualquer momento e podemos escolher como ele vai ser executado. Por exemplo:

```
val printLater = printLog.delay(5.seconds)
```
Estamos definindo que a mensagem será exibida com um delay de 5 segundos depois da invocação.

### Como executar

A forma mais simples de executar o efeito é estender da trait `ZIOAppDefault` e implementar o método `run`:

```
import zio._

object Main extends ZIOAppDefault {

	val printLog = ZIO.succeed(println("Hello, Scala!"))

	val printLater = printLog.delay(5.second)
  
	override def run = printLater
}
```

### Composição sequencial

Como visto, os efeitos ZIO são modelos que descrevem fluxos concorrentes e podemos combiná-los e transformá-los para gerar outros efeitos. 

Um método do ZIO bastante importante é o `flatMap`, que representa uma composição sequencial de dois efeitos e nos permite criar um segundo efeito após a execução e resultado do primeiro.

A seguir um exemplo que lê os dados do input do usuário e depois exibe esse resultado digitado:

```
import scala.io.StdIn

val readLine = ZIO.attempt(StdIn.readLine())

def printLine(line: String) = ZIO.attempt(println(line))

val echo = readLine.flatMap(line => printLine(line))
```

Perceba que inicialmente apenas definimos cada ação (readLine e printLine) e por fim combinamos esses dois efeitos com `flatMap`. O que estamos dizendo é: Execute o readLine, com o resultado desse efeito, execute o segundo efeito printLine passando como parâmetro o que foi lido no efeito anterior.

Essa é uma abstração semelhante ao modelo procedural onde uma ação ocorre após a outra e permite encadear vários efeitos sequenciais.

Vamos imaginar um programa procedural com esse código:

```
val data = doQuery(query)
val response = generateResponse(data)
writeResponse(response)
```
Ele pode ser traduzido para ZIO como:

```
ZIO.attempt(doQuery(query)).flatMap(data =>
	ZIO.attempt(generateResponse(data)).flatMap(response =>
		ZIO.attempt(writeResponse(response))
	)
)
```

### For-Comprehensions

Quando passamos de duas ou três operações `flatMap` o código começa a ficar mais confuso devido ao aninhamento. Nesses casos temos o recurso **For-Comprehensions** do Scala que permite definir composições sequenciais de um jeito mais legível.

Voltando ao exemplo do printLine, podemos reescrevê-lo assim:

```
import zio._

val echo =
	for {
		line <- readLine
		_    <- printLine(line)
	} yield ()
```

A leitura fica mais fácil pois fica semelhante ao modelo procedural.

A estrutura é iniciada pela palavra-chave `for`, seguida por um bloco de código e encerrada pela palavra-chave `yield`, que é seguida por um único parâmetro, representando o valor de sucesso do efeito.

Cada linha do For Comprehension é escrita usando o formato `result <- effect`, onde `effect` retorna um efeito e `result` é uma variável que armazenará o valor de sucesso do efeito. Se o resultado do efeito não for necessário, então o underline pode ser usado como nome da variável.

### Aliases

Apesar do tipo mais completo do ZIO que vimos, que é o tipo **ZIO[R, E, A]**. Temos outros tipos como pseudônimos, pois podemos saber que uma aplicação não requer um ambiente externo, ou que só pode falhar com um determinado tipo de erro, ou que não pode falhar de forma alguma.

Os principais aliases e seus significados são:

**IO[E, A]** - Um efeito que não requer nenhum ambiente, pode falhar com um **E** ou pode ser bem-sucedido com um **A**.

**Task[A]** - Um efeito que não requer nenhum ambiente, pode falhar com um **Throwable**, ou pode ser bem-sucedido com um **A**.

**RIO[R, A]** - Um efeito que requer um ambiente do tipo **R**, pode falhar com um **Throwable**, ou pode ser bem-sucedido com um **A**.

**UIO[A]** - Um efeito que não requer nenhum ambiente, não pode falhar e é bem-sucedido com um **A**.

**URIO[R, A]** - Um efeito que requer um ambiente do tipo **R**, não pode falhar e pode ser bem-sucedido com um **A**.

Vários outros tipos de dados no ZIO e em outras bibliotecas do ecossistema ZIO usam aliases de tipo semelhantes; portanto, se você estiver familiarizado com eles, também será capaz de compreendê-los rapidamente.

### Conclusão

Essa é uma apresentação introdutória sobre efeitos e programação funcional com ZIO e espero que tenha sido uma apresentação clara, diferente de quando vi a sintaxe pela primeira vez e demorei para entender os conceitos e como as coisas funcionavam. Provavelmente eu venha a postar mais assuntos relacionados, mas até lá, deixo o livro de principal fonte de informação nas referências.

### Referências

Zionomicon - John A. De Goes, Adam Flaser, Milad Khajavi - https://zionomicon.com/