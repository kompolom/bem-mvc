glue()
------
Проклеить BEM-блоки полей с полями модели


_initModel(\[modelParams\], \[modelData\])
------------------------------------------
Инициализирует модель, соответствующую данному блоку


**Parameters**

**[modelParams]**:  *Object*,  Параметры модели

**[modelData]**:  *Object*,  Данные для инициализации модели

_initFields()
-------------
Инициализирует поля и провязывает их с моделью


initFieldBlock(elem)
--------------------
Инициализируем блок glue-field (или его потомка) на BEM-блоке


**Parameters**

**elem**:  *jQuery*,


getFieldBlock(name)
-------------------
Возвращает BEM-блок по имени поля из модели


**Parameters**

**name**,  Имя поля

getModelParams()
----------------
Возвращает параметры модели


getModelPath()
--------------
Возвращает путь к модели, соответствующей данному блоку


getModelName()
--------------
Возвращает имя модели, соответствующей данному блоку


